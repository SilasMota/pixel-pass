import PasswordInput from '../components/PasswordInput'
import ImageUploader from '../components/ImageUploader'
import { AES } from 'crypto-js'

import {
  ArrowRightStartOnRectangleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import { saveAs } from 'file-saver'

// eslint-disable-next-line react/prop-types
export default function EncodePage({ passKey }) {
  // eslint-disable-next-line no-unused-vars
  const [formLayout, setFormLayout] = useState([
    {
      label: 'User',
      value: null
    },
    {
      label: 'Password',
      value: null
    }
  ])
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState()
  const [canvas, setCanvas] = useState()
  const [encodedImage, setEncodedImage] = useState(null)
  const [name, setName] = useState(null)
  const image = new Image()

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

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    setCanvas(canvas)
    setCtx(context)
  }, [ctx])

  // -------- ENCODING ----------
  const encodeText = () => {
    // Validation of text to be encoded
    const info = formLayout

    let text = JSON.stringify(info)

    //Encrypting object with passKey
    text = AES.encrypt(text, passKey).toString()
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
  }

  const downloadImage = () => {
    saveAs(encodedImage, name ? name : 'image.jpg')
  }

  const fnHandleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="flex min-h-full flex-1 flex-col px-6 py-6 lg:px-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className=" text-gray-50 items-center text-center text-lg mb-10 font-medium">
          Encode Credentials
        </h1>
        <form className="space-y-6" onSubmit={fnHandleSubmit}>
          <div className="space-y-3 ">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium leading-6 text-gray-200"
            >
              File Name
            </label>
            <input
              type="text"
              placeholder="Name"
              className=" p-4 block bg-slate-700 w-full rounded-md border-0 py-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />

            {formLayout.map((field) => (
              <div key={field.label}>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    {field.label}
                  </label>
                </div>
                <PasswordInput
                  label={field.label}
                  formLayout={formLayout}
                  setFormLayout={setFormLayout}
                  canSugest={true}
                />
              </div>
            ))}

            {/* <button className="flex ml-auto justify-center items-center rounded-md border-gray-300 border-2 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <PlusIcon className="w-5 h-5" />
            </button> */}
          </div>

          <div className="col-span-full">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium leading-6 text-gray-200"
            >
              Choose an image
            </label>
            <ImageUploader handleFileUpload={handleFileUpload} />
          </div>

          <div>
            <button
              type="submit"
              className="flex space-x-2 w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={encodeText}
            >
              <span>Encode</span>
              <LockClosedIcon className=" h-3 w-3" />
            </button>
          </div>

          <div className="flex space-x-1">
            {/* <button className="flex space-x-2 w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <span>Save</span>
              <PhotoIcon className=" h-3 w-3" />
            </button> */}

            <button
              className="flex space-x-2 w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={downloadImage}
            >
              <span>Export</span>
              <ArrowRightStartOnRectangleIcon className=" h-3 w-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}