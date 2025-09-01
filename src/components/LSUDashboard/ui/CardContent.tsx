import * as React from 'react'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={"p-6 pt-0" + className} {...props} />
))
CardContent.displayName = 'CardContent'

export default CardContent;