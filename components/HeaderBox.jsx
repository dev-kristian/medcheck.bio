const HeaderBox = ({ type = 'title', user, title, subtext, testType }) => {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {type === 'greeting' && (
          <>
            {title}
            <span className="text-medicalGradient">
              &nbsp;{user}
            </span>
          </>
        )}
        {type === 'testResult' && (
          <>
            Analysis Results for <span className="text-medicalGradient">{testType}</span>
          </>
        )}
        {(type === 'myTests' || type === 'addTest' || type === 'title' || type === 'aiChat') && (
          <>{title}</>
        )}
      </h1>
      {subtext && <p className="header-box-subtext">{subtext}</p>}
    </div>
  );
}

export default HeaderBox;