import React from 'react'
import Sound from 'react-sound'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import VolumeOffIcon from '@material-ui/icons/VolumeOff'
import IconButton from '@material-ui/core/IconButton'

class SoundBgm extends React.Component {
  constructor(props) 
  {
    super(props)
    this.state = {
      soundOn: true,
      status: Sound.status.PLAYING,
    }
  }

  render() {
    const SoundBtnIcon = this.state.soundOn ? <VolumeUpIcon /> : <VolumeOffIcon /> 

    return(
      <div className="sound">
        <Sound url="freetime.mp3" playStatus={Sound.status.PLAYING} />
        <IconButton 
          onClick = {() => {
            const soundPlay = this.state.soundOn ? 'Sound.status.STOPPED' : 'Sound.status.PLAYING'
            this.setState({
              soundOn: !this.state.soundOn,
              status: {soundPlay},
            })
          }}
        >
          {SoundBtnIcon}
        </IconButton>
      </div>
    )

  }
  

}

export default SoundBgm