import { useState } from 'react'
import { PhotoIcon } from '@heroicons/react/24/solid'

// eslint-disable-next-line react/prop-types
export default function ImageUploader({ handleFileUpload }) {
  const [image, setImage] = useState(null)

  function handleChange(e) {
    setImage(e.target.files[0])
    handleFileUpload(e)
  }

  return (
    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300/25 px-6 py-10">
      <div className="text-center">
        {image && (
          <div className="mx-auto flex">
            <img className="rounded-lg" src={image && URL.createObjectURL(image)} alt="" />
          </div>
        )}
        {!image && <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-100" />}
        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md font-semibold text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".gif, .jpg"
              className="sr-only"
              onChange={handleChange}
            />
          </label>
          {/* <p className="pl-1 text-gray-100">or drag and drop</p> */}
        </div>
        <p className="text-xs leading-5 text-gray-100">JPG or GIF</p>
      </div>
    </div>
  )
}
