import React, { Component } from 'react'
import classNames from 'classnames'

import ViewerToolbar from './ViewerToolbar'
import ImageViewer from './ImageViewer'
import AudioViewer from './AudioViewer'
import VideoViewer from './VideoViewer'
import NoViewer from './NoViewer'

import styles from './viewer'

const KEY_CODE_LEFT = 37
const KEY_CODE_RIGHT = 39

export default class Viewer extends Component {
  state = {
    controlsHidden: false
  }

  showControls = () => {
    this.setState({ controlsHidden: false })
    document.removeEventListener('mousemove', this.showControls)
  }
  hideControls = () => {
    this.setState({ controlsHidden: true })
    document.addEventListener('mousemove', this.showControls)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false)
    document.addEventListener('mousemove', this.showControls)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDownCallback, false)
    document.removeEventListener('mousemove', this.showControls)
  }

  onKeyDown = e => {
    if (e.keyCode === KEY_CODE_LEFT) this.onPrevious()
    else if (e.keyCode === KEY_CODE_RIGHT) this.onNext()
  }

  onNext = () => {
    const { files, currentIndex } = this.props
    if (currentIndex === files.length - 1) {
      return
    }
    const nextIndex = currentIndex + 1
    const nextFile = files[nextIndex]
    this.onChange(nextFile, nextIndex)
  }

  onPrevious = () => {
    const { files, currentIndex } = this.props
    if (currentIndex === 0) {
      return
    }
    const prevIndex = currentIndex - 1
    const prevFile = files[prevIndex]
    this.onChange(prevFile, prevIndex)
  }

  onChange(nextFile, nextIndex) {
    if (this.props.onChange) {
      this.props.onChange(nextFile, nextIndex)
    }
  }

  render() {
    const { files, currentIndex, onClose } = this.props
    const currentFile = files[currentIndex]
    const fileCount = files.length
    const hasPrevious = currentIndex > 0
    const hasNext = currentIndex < fileCount - 1

    const { controlsHidden } = this.state
    return (
      <div className={styles['pho-viewer-wrapper']} role="viewer">
        <ViewerToolbar
          hidden={controlsHidden}
          onHide={this.hideControls}
          currentFile={currentFile}
          onClose={onClose}
        />
        {hasPrevious && (
          <a
            role="button"
            className={classNames(styles['pho-viewer-nav-previous'], {
              [styles['pho-viewer-nav-previous--hidden']]: controlsHidden
            })}
            onClick={this.onPrevious}
          />
        )}
        {this.renderViewer(currentFile)}
        {hasNext && (
          <a
            role="button"
            className={classNames(styles['pho-viewer-nav-next'], {
              [styles['pho-viewer-nav-next--hidden']]: controlsHidden
            })}
            onClick={this.onNext}
          />
        )}
      </div>
    )
  }

  renderViewer(file) {
    if (!file) return null
    switch (file.class) {
      case 'image':
        return (
          <ImageViewer
            file={file}
            onSwipeLeft={this.onNext}
            onSwipeRight={this.onPrevious}
            onTap={this.showControls}
          />
        )
      case 'audio':
        return (
          <AudioViewer
            file={file}
            onSwipeLeft={this.onNext}
            onSwipeRight={this.onPrevious}
          />
        )
      case 'video':
        return (
          <VideoViewer
            file={file}
            onSwipeLeft={this.onNext}
            onSwipeRight={this.onPrevious}
          />
        )
      default:
        return (
          <NoViewer
            file={file}
            onSwipeLeft={this.onNext}
            onSwipeRight={this.onPrevious}
          />
        )
    }
  }
}
