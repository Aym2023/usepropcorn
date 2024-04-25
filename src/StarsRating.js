
const continerStyle = {
display:'flex',
alignItems: 'center',
gap: '16px'
};

const starContinerStyle = {
 display: 'flex',
 gap: '4px'
};

const textStyle = {
  lineHeight: '1',
  margin: '0'
};

export default function StarsRating ({maxrating = 5}) {
    return (
       <div style={continerStyle}>
        <div style={starContinerStyle}>
       {Array.from({length: maxrating}, (_, i) => 
       <span>S{i + 1}</span>
    )}
       </div>
      <p style={textStyle}>10</p>
        </div>
    );
}