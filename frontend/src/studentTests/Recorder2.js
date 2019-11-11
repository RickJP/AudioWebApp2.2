import React, {Component} from 'react';
import RecorderJS from 'recorder-js';
import axios from 'axios';
import { isAuthenticated } from "../auth";
import {getAudioStream, exportBuffer} from './audio';
import moment from 'moment';
import slugify from 'slugify';


class Recorder2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: null,
      recording: false,
      recorder: null,
      test: false
    };
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
  }

  async componentDidMount() {
    let stream;

    try {
      stream = await getAudioStream();
    } catch (error) {
      // Users browser doesn't support audio.
      // Add your handler here.
      console.log(error);
    }

    this.setState({stream});

    //this.startRecord();
  }

  startRecord() {
    console.log('RECORDING....');
    const {test} = this.state;
    console.log(test);
    const {stream} = this.state;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const recorder = new RecorderJS(audioContext);
    recorder.init(stream);

    this.setState(
      {
        recorder,
        recording: true,
      },
      () => {
        recorder.start();
      }
    );
  }

  createUserSlug = () => {
    const {
      user: { name}
    } = isAuthenticated();
    return slugify(name, {
      replacement: '-',    // replace spaces with replacement
      remove: null,        // regex to remove characters
      lower: true,         // result in lower case
    });
  }

  createDateTimeStamp = () => {
    return moment().format("YYYY_MM_ddd_hh-mm-ss-a");
  }


  async stopRecord() {
    const {recorder} = this.state;
    const {buffer} = await recorder.stop();
    const audio = exportBuffer(buffer[0]);

    const userSlug = this.createUserSlug();
    const dtStamp = this.createDateTimeStamp();

    let data = new FormData();
    data.append('soundBlob', audio);
    // const url = `https://english4all.live/api/upload/${nameSlug}/${dateTimeStamp}`;
    const url = `http://localhost:8000/api/upload/${userSlug}/${dtStamp}`;
    let config = {
      header : {
        'Content-Type' : 'multipart/form-data'
      }
    }

    axios.post(url, data, config).then(response => {
      console.log('response', response)
    }).catch(error => {
      console.log('error', error)
    })

    this.setState({
      recording: false,
    });
  }

  render() {
    const {recording, stream} = this.state;

    // Don't show record button if their browser doesn't support it.
    if (!stream) {
      return null;
    }

    return (
      <div></div>
      // <button
      //   onClick={() => {
      //     recording ? this.stopRecord() : this.startRecord();
      //     console.log('RECORDING....')
      //   }}
      // >
      //   {recording ? 'Stop' : 'Rec'}
      // </button>
    )
    }
}

export default Recorder2;

