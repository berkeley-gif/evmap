const MarkLabel: React.FC<{ range: number }> = ({ range }) => (
  <div className="slider-mark-label">
    <span>0</span>
    <span>{range / 2}</span>
    <span>{range}</span>
  </div>
)

export default MarkLabel
