function Button({
    children, //children
    type = 'button',
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    classname ='',
    ...props
}) {
    return(
        <button className={`px-4 py-2 rounded-lg cursor-pointer ${bgColor} ${textColor} ${classname}`} {...props} type={type}>
            {children}
        </button>
    )
    
}

export default Button;