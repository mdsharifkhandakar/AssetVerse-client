const RobotLoader = ({ text = "Loading..." }) => {
  return (
    <div className="robot-loader-container">
      <div className="robot-runner">
        {/* HEAD */}
        <div className="robot-head">
          <div className="robot-eye left" />
          <div className="robot-eye right" />
        </div>

        {/* BODY */}
        <div className="robot-body">
          <div className="robot-arm left-arm" />
          <div className="robot-arm right-arm" />
        </div>

        {/* LEGS */}
        <div className="robot-legs">
          <div className="leg left-leg" />
          <div className="leg right-leg" />
        </div>
      </div>

      <p className="auth-text">{text}</p>
    </div>
  );
};

export default RobotLoader;
