import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior Secondary (12th), CBSE</h4>
                <h5>XYZ Public School, Delhi</h5>
              </div>
              <h3>2021-2022</h3>
            </div>
            <p>
              Completed 12th grade with 88%. Developed a strong foundation in core subjects.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in CSE</h4>
                <h5>ABC Institute of Technology, Delhi</h5>
              </div>
              <h3>2022-2026</h3>
            </div>
            <p>
              Pursuing Bachelor of Technology with a CGPA of 8.5/10. Core subjects: Data Structures, Operating Systems, DBMS. Actively participating in hackathons and exploring new technologies.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Development Intern</h4>
                <h5>Tech Solutions Pvt. Ltd.</h5>
              </div>
              <h3>May-Jul 2025</h3>
            </div>
            <p>
              Assisted in developing REST APIs using Node.js. Worked on frontend features using React.js. Collaborated with team using Git for version control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
