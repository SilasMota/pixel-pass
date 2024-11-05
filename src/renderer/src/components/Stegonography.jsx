import { useRef, useEffect, useState } from 'react'
import { saveAs } from 'file-saver'

export default function Stegonography() {
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState()
  const [canvas, setCanvas] = useState()
  const [encodedImage, setEncodedImage] = useState(null)
  const [decodedText, setDecodedText] = useState(null)
  const image = new Image()

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    setCanvas(canvas)
    setCtx(context)
  }, [ctx])

  function handleFileUpload(event) {
    const reader = new FileReader()
    reader.onload = function (e) {
      image.src = e.target.result
      image.onload = function () {
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0)
      }
    }
    reader.readAsDataURL(event.target.files[0])
  }

  // -------- ENCODING ----------
  const encodeText = () => {
    // Validation of text to be encoded
    const info = {
      user: 'user',
      password: 'pass'
    }
    const text = JSON.stringify(info)
    if (!text) {
      alert('Please enter some text to encode.')
      return
    }

    // Extracting image data
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imgData.data
    let binaryText = ''

    // Looping to convert text message to binary text
    for (let i = 0; i < text.length; i++) {
      let binaryChar = text.charCodeAt(i).toString(2).padStart(8, '0')
      binaryText += binaryChar
    }

    // Adding null byte to the end of the binary text so we know when to stop
    binaryText += '00000000'

    // Validating if the image is long enough to encode the message
    if (binaryText.length > data.length / 4) {
      alert('Text is too long to encode in this image.')
      return
    }

    // Loop through image bytes replacing LSB with bites on the binary text
    for (let i = 0; i < binaryText.length; i++) {
      data[i * 4] = (data[i * 4] & 0b11111110) | parseInt(binaryText[i])
    }

    // Outputing the image
    ctx.putImageData(imgData, 0, 0)
    setEncodedImage(canvas.toDataURL())
    // const outputImage = document.getElementById('outputImage')
    // outputImage.src = canvas.toDataURL()
  }

  function decodeText() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imgData.data
    let binaryText = ''
    let decodedText = ''

    // Looping through image bytes to get the binary text for the message
    for (let i = 0; i < data.length; i += 4) {
      binaryText += (data[i] & 1).toString()
    }

    console.log(binaryText)
    // Parsing the binary text to string
    for (let i = 0; i < binaryText.length; i += 8) {
      let byte = binaryText.slice(i, i + 8)
      if (byte.length < 8) break // Stop if the byte is incomplete
      let charCode = parseInt(byte, 2)
      if (charCode === 0) break // Stop if we hit a null character
      decodedText += String.fromCharCode(charCode)
    }

    // Outputting the decoded message
    console.log(decodedText)
    setDecodedText(JSON.parse(decodedText))
  }

  const downloadImage = () => {
    saveAs(encodedImage, 'image.jpg') // Put your image URL here.
  }

  return (
    <div >
      <input type="file" id="upload" accept="image/*" onChange={handleFileUpload} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {encodedImage && <img id="outputImage" alt="Output Image" src={encodedImage}></img>}
      {decodedText && <h1>{JSON.stringify(decodedText)}</h1>}
      <div className=''>
        <button id="encode" onClick={encodeText}  className="flex ml-auto justify-center items-center rounded-md border-gray-300 border-2 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Encode Text
        </button>
        <button id="encode" onClick={decodeText}  className="flex ml-auto justify-center items-center rounded-md border-gray-300 border-2 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Decode Text
        </button>
        <button onClick={downloadImage}  className="flex ml-auto justify-center items-center rounded-md border-gray-300 border-2 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Download Image
        </button>
      </div>
    </div>
  )
}
