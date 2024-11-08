import PasswordInput from '../components/PasswordInput'
import ImageUploader from '../components/ImageUploader'
import { DocumentDuplicateIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import { AES, enc } from 'crypto-js'

// eslint-disable-next-line react/prop-types
export default function DecodePage({ passKey }) {
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

  const fnHandleSubmit = (event) => {
    event.preventDefault()
  }

  function decodeText() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imgData.data
    let binaryText = ''
    let decodedText = ''
    // let decodedBinary = ''

    // Looping through image bytes to get the binary text for the message
    for (let i = 0; i < data.length; i += 4) {
      binaryText += (data[i] & 1).toString()
    }

    
    // console.log(binaryText)

    // Parsing the binary text to string
    for (let i = 0; i < binaryText.length; i += 8) {
      let byte = binaryText.slice(i, i + 8)
      if (byte.length < 8) {
        console.log("byte is incomplete")
        break 
      }// Stop if the byte is incomplete
      let charCode = parseInt(byte, 2)
      if (charCode === 0){
        console.log("we hit a null character")
        break // Stop if we hit a null character
      }
      // decodedBinary += byte
      decodedText += String.fromCharCode(charCode)
    }
    // decodedBinary += "00000000"
    // console.log(decodedText)
    // console.log(decodedBinary)
    

    // Outputting the decoded message
    try {
      //Decrypting object with passKey
      // console.log(AES.decrypt(decodedText, passKey).toString(enc.Utf16))
      decodedText = AES.decrypt(decodedText, passKey).toString(enc.Utf8)
      // console.log(decodedText)
      setFormLayout(JSON.parse(decodedText))
    } catch (error) {
      // console.log(error)
      setFormLayout([
        {
          label: 'User',
          value: null
        },
        {
          label: 'Password',
          value: null
        }
      ])
    }
  }
  return (
    <div className="flex min-h-full flex-1 flex-col px-6 py-6 lg:px-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className=" text-gray-50 items-center text-center text-lg mb-10 font-medium">
          Decode Credentials
        </h1>
        <form className="space-y-6" onSubmit={fnHandleSubmit}>
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
              onClick={decodeText}
            >
              <span>Decode</span>
              <LockOpenIcon className=" h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3 ">
            {formLayout.map((field) => (
              <div key={field.label}>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    {field.label}
                  </label>
                </div>
                <div className="flex justify-between">
                  <span className="basis-10/12">
                    <PasswordInput label={field.label} value={field.value} disabled="true" />
                  </span>
                  <button
                    className="flex justify-center items-center bg-slate-700 rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => navigator.clipboard.writeText(field.value)}
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="flex space-x-1">
            <button className="flex space-x-2 w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <span>Import</span>
              <PhotoIcon className=" h-3 w-3" />
            </button>
          </div> */}
        </form>
      </div>
    </div>
  )
}
