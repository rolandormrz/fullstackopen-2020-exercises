import React from 'react';
import Statistic from './Statistic';

const tableStyling = {
  border: 'solid 1px black',
  marginLeft: '5px'
}

const Statistics = ({ feedback, total }) => {
  const average = () => total === 0 ? 0 : (total / 3).toFixed(2);
  const positive = () => {
    let positivePercentage = total === 0 ? 0 : ((feedback.good / total) * 100).toFixed(2);
    return positivePercentage += '%';
  };

  return (
    <div>
      <h2>Statistics</h2>
      { total === 0 
        ? <p>No feedback given.</p> 
        : <table style={tableStyling}>
            <tbody>
              <Statistic text={'Good'} value={feedback.good} />
              <Statistic text={'Neutral'} value={feedback.neutral} />
              <Statistic text={'Bad'} value={feedback.bad} />
              <Statistic text={'All'} value={total} />
              <Statistic text={'Average'} value={average()} />
              <Statistic text={'Positive'} value={positive()} />
            </tbody>
          </table>
      }
    </div>
  );

}

export default Statistics;