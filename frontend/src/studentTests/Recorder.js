/* eslint-disable no-console */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MicRecorder from 'mic-recorder-to-mp3';
import {sendAudio} from './sendAudio';

const Mp3Recorder = new MicRecorder({bitRate: 128});

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
    };

    this.start = () => {
      if (this.state.isBlocked) {
        console.log('Permission Denied');
      } else {
        Mp3Recorder.start()
          .then(() => {
            this.setState({isRecording: true});
            console.log('STARTED RECORDING....');
          })
          .catch(e => console.error(e));
      }
    };
    
    this.stopAndSendAudio = () => {
      Mp3Recorder.stop()
        .getMp3()
        // buffer, audio    buffer unused
        .then(([,audio]) => {
          //const blobURL = URL.createObjectURL(audio);
          this.setState({isRecording: false});
          console.log('...STOPPED! Recording ');
          
          const user_Id = this.userId;

          let data = new FormData();
          data.append('soundBlob', audio);

          // Sends the recorded audio data
          sendAudio(user_Id, data);

          
        })
        .catch(e => console.log(e));
    };

    this.stop= () => {
      Mp3Recorder.stop()
        .getMp3()
        // buffer, audio    buffer unused
        .then(() => {
          this.setState({isRecording: false});
          console.log('Stopped audio without saving');
        })
        .catch(e => console.log(e));
    };
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia(
      {audio: true},
      () => {
        console.log('Permission Granted');
        this.setState({isBlocked: false});
      },
      () => {
        console.log('Permission Denied');
        this.setState({isBlocked: true});
      }
    );
  }

  componentWillUnmount() {
    // let {isRecording} = this.state;
    // console.log('willUnmount');
    // console.log(this.props);
    // console.log('recording > '+isRecording);
    // if (isRecording) {
    //   console.log('Still recording');
    //   this.stop();
    //   console.log('recording > '+isRecording);
    // } 
  }

  UNSAFE_componentWillReceiveProps({trackNo, audioFiles}) {
    let {recording} = this.state;

    if (!recording && trackNo === 1) {
      this.start();
    }
    if (recording && trackNo === audioFiles.length) {
      this.stopAndSendAudio();
    }
  }

  render() {
    return (<div className="App"></div>);
  }
}

Recorder.propTypes = {
  isRecording: PropTypes.bool,
  blobURL: PropTypes.string,
  isBlocked: PropTypes.bool,
  recording: PropTypes.bool,
  trackNo: PropTypes.number,
  audioFiles: PropTypes.array,
}

export default Recorder;
