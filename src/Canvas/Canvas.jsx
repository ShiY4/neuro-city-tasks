import React from 'react';
import { saveAs } from 'file-saver';
import './Canvas.css'

export default class Canvas extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      image: null,
      imageSrc: null,
      rotation: 0,
    }
  }

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const src = URL.createObjectURL(file);
      this.setState({imageSrc: src})
      this.setState({image: file})
      this.setState({rotation: 0})
    }
  };

  handleRotate = () => {
    const { rotation } = this.state
    this.setState({rotation: (rotation + 90) % 360})
  };

  handleSave = () => {
    const { imageSrc, rotation, image } = this.state
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      switch(rotation){
        case 90:
        case 270:
          canvas.width = img.height;
          canvas.height = img.width;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          break;
        case 180:
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.rotate((180 * Math.PI) / 180);
          ctx.drawImage(img, -img.width, -img.height);
          break;
        case 0:
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          break;
        default:
          console.log("default");
      }
      canvas.toBlob((blob) => {
        saveAs(blob, `rotated_on_${rotation}deg${image.name}`);
      });
    };
  };


  render() {
    const { imageSrc, rotation } = this.state
    return (
      <div className="canvas-container" style={{ textAlign: 'center', padding: '20px' }}>
        <h1 className='canvas-title'>Вращение изображений</h1>
        <form method="post" enctype="multipart/form-data">
          <label className='canvas-input'>
	   	      <input className='canvas-input__input' type="file" name="file" onChange={this.handleImageChange} accept="image/png, image/jpeg"/>		
	   	      <span className='canvas-input__span'>Выберите файл</span>
 	        </label>
        </form>
        {imageSrc && (
          <div className='canvas-main'>
            <div>
              <h2 className='canvas-subtitle'>Предпросмотр:</h2>
              <div>
                <button className='canvas-button' onClick={this.handleRotate}>Вращать</button>
                <button className='canvas-button' onClick={this.handleSave}>Сохранить</button>
              </div>
            </div>
            <div className='canvas-img' style={{ transform: `rotate(${rotation}deg)`, display: 'block' }}>
              <img src={imageSrc} alt="Preview" style={{ maxWidth: '50%', maxHeight: '300px',  }} />
            </div>
          </div>
        )}
      </div>
    )
  }
}