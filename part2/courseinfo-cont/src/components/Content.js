import React from 'react';
import Part from './Part';

const Content = props => {
  const partComponents = props.parts.map(part => <Part part={part} key={part.id} />)

  return (
    <div>
      {partComponents}
    </div>
  );
}

export default Content;