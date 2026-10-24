import re

SKILL_ALIASES={
     "python": ["python", "python programming"],
    "javascript": ["javascript", "js"],
    "react": ["react", "react.js", "reactjs"],
    "node.js": ["node.js", "nodejs", "node js"],
    "sql": ["sql", "structured query language"],
    "mongodb": ["mongodb", "mongo db"],
    "rest api": [
        "rest api",
        "rest apis",
        "restful api",
        "restful apis",
    ],
    "git": ["git", "git version control"],
    "machine learning": [
        "machine learning",
        "ml",
    ],
    "data structures": [
        "data structures",
        "data structure",
    ],
}

def normalize_text(text):
    text=text.lower()
    text=re.sub(r"\s+"," ",text)
    return text.strip()

def extract_skills(text):
    text=normalize_text(text)
    found_skills=set()

    for skill,aliases in SKILL_ALIASES.items():
        for alias in aliases:
            pattern=(
                r"(?<![a-z0-9])"
                + re.escape(alias)
                +r"(?![a-z0-9])"
            )

            if re.search(pattern,text):
                found_skills.add(skill)
                break
    return found_skills

def analyze_resume(resume_text,job_description):
    resume_skills=extract_skills(resume_text)
    required_skills=extract_skills(job_description)

    if not required_skills:
        return{
            "matched_score":None,
            "matched_skills":None,
            "missing_skills":[],
            "extra_skills":sorted(resume_skills),
            "message":(
                "No recognized skills were found"
                "in the job description"
            ),
        }
    matched_skills=resume_skills & required_skills
    missing_skills=required_skills-resume_skills
    extra_skills=resume_skills-required_skills

    score=round(len(matched_skills)/len(required_skills) *100,2)

    return{
        "matched_score":score,
        "matched_skills":sorted(matched_skills),
        "missing_skills":sorted(missing_skills),
        "extra_skills":sorted(extra_skills),
        "message":(
            f"Your resume covers {len(matched_skills)}"
            f"out of {len(required_skills)} recognized"
            f"job skills."
        ),
    }

if __name__=="__main__":
    resume="""Computer Science student with Python programming
    and React.js experience. Built a web application
    using RESTful APIs and Git version control.
    Familiar with NodeJS and Mongo DB.api .sql/"""

    job_description="""We are looking for a developer with Python,
    SQL, React, REST API, Git, and MongoDB api skills."""

    result=analyze_resume(resume,job_description)
    print("Resume Analysis:")
    print("-"*30)
    print(f"Match Score:{result['matched_score']}%")
    print(f"Matched Skills:{result['matched_skills']}")
    print(f"Missing Skills: {result['missing_skills']}")
    print(f"Additional Skills:{result['extra_skills']}")
    print(f"{result['message']}")
