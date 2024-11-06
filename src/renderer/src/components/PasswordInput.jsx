/* eslint-disable react/prop-types */
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

export default function PasswordInput({ label, formLayout, setFormLayout, canSugest, ...props }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [sugestedPassword, setSugestedPassword] = useState(null)
  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState)
  }

  function onInputChange(e) {
    formLayout.find((obj) => obj.label == label).value = e.target.value
    setFormLayout(formLayout)
    setSugestedPassword(e.target.value)
  }

  const sugestPassword = (label) => {
    let newPassword = Math.random().toString(36).slice(2, 10)
    setSugestedPassword(newPassword)
    formLayout.find((obj) => obj.label == label).value = newPassword
    setFormLayout(formLayout)
  }

  return (
    <div className="flex justify-between space-x-2">
      <span className="w-full">
        <div className="relative">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder={label}
            className=" p-4 block bg-slate-700 w-full rounded-md border-0 py-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={onInputChange}
            {...props}
            value={sugestedPassword ? sugestedPassword : props.value}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-300"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className=" w-5 h-5" />
            ) : (
              <EyeIcon className=" w-5 h-5" />
            )}
          </button>
        </div>
      </span>

      {canSugest && (
        <button
          className="flex justify-center items-center bg-slate-700 rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          title="Sugerir uma senha"
          onClick={() => sugestPassword(label)}
        >
          <ShieldCheckIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
