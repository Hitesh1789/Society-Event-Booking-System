import { useId, forwardRef } from "react";

function Select({
    label,
    options=[],
    className = '',
    ...props
}, ref) {
    const id = useId();

    return (
        <div className='w-full'>
            {label && <label className="" htmlFor={id}>{label}</label>}
            <select
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-fulln ${className}`}
                {...props}
                id={id}
                ref={ref}
            >
                {options?.map((option) => {
                    return <option key={option.value} value={option.value}>{option.label}</option>
                })}
            </select>
        </div>
    )
}

export default forwardRef(Select);