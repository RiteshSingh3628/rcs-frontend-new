import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${padding} ${className}`.trim();

  const CardComponent = hover ? motion.div : 'div';
  const motionProps = hover
    ? {
        whileHover: { y: -2 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <CardComponent className={classes} {...motionProps} {...props}>
      {children}
    </CardComponent>
  );
};

export default Card;