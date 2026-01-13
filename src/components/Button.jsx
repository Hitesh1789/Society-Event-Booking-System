function Button({
    children, //children
    type = 'button',
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className ='',
    ...props
}) {
    return(
        <button className={`px-2 py-2 rounded-lg cursor-pointer ${bgColor} ${textColor} ${className} `} {...props} type={type}>
            {children}
        </button>
    )
    
}

export default Button;