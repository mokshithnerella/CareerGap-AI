"""Curated Skill Taxonomy, Seed Job Roles, and Verified Learning Resources.

Provides canonical skill mappings, aliases, 15 complete industry job roles,
and 40+ verified educational resources.
"""

from app.models.schemas import (
    SkillCategory,
    JobSkillRequirement,
    JobRole,
    LearningResource,
)

# 1. Canonical Skill Dictionary & Aliases
SKILL_TAXONOMY: dict[str, dict] = {
    # Programming Languages
    "Python": {
        "category": SkillCategory.PROGRAMMING_LANGUAGE,
        "aliases": ["python3", "python 3", "py"],
        "prerequisites": [],
        "description": "High-level programming language widely used in AI, backend, data science, and scripting.",
    },
    "JavaScript": {
        "category": SkillCategory.PROGRAMMING_LANGUAGE,
        "aliases": ["js", "es6", "ecmascript"],
        "prerequisites": [],
        "description": "Universal language of the web for client-side and server-side execution.",
    },
    "TypeScript": {
        "category": SkillCategory.PROGRAMMING_LANGUAGE,
        "aliases": ["ts"],
        "prerequisites": ["JavaScript"],
        "description": "Typed superset of JavaScript providing compile-time type safety.",
    },
    "SQL": {
        "category": SkillCategory.PROGRAMMING_LANGUAGE,
        "aliases": ["structured query language", "ansi sql", "t-sql", "pl/sql"],
        "prerequisites": [],
        "description": "Standard declarative query language for relational database management.",
    },
    "Java": {
        "category": SkillCategory.PROGRAMMING_LANGUAGE,
        "aliases": ["java 17", "java 21", "core java"],
        "prerequisites": [],
        "description": "Enterprise object-oriented language running on the JVM.",
    },
    "Go": {
        "category": SkillCategory.PROGRAMMING_LANGUAGE,
        "aliases": ["golang"],
        "prerequisites": [],
        "description": "Compiled, concurrent systems language designed for high-throughput cloud infrastructure.",
    },
    "C++": {
        "category": SkillCategory.PROGRAMMING_LANGUAGE,
        "aliases": ["cpp", "c/c++"],
        "prerequisites": [],
        "description": "High-performance systems programming language with explicit memory management.",
    },
    "HTML/CSS": {
        "category": SkillCategory.PROGRAMMING_LANGUAGE,
        "aliases": ["html", "css", "html5", "css3"],
        "prerequisites": [],
        "description": "Fundamental semantic markup and styling standards for web development.",
    },

    # Frameworks & Libraries
    "React": {
        "category": SkillCategory.FRAMEWORK,
        "aliases": ["react.js", "reactjs"],
        "prerequisites": ["JavaScript", "HTML/CSS"],
        "description": "Declarative component-based UI library for modern web applications.",
    },
    "Next.js": {
        "category": SkillCategory.FRAMEWORK,
        "aliases": ["nextjs", "next"],
        "prerequisites": ["React", "TypeScript"],
        "description": "Production React framework with server-side rendering and App Router.",
    },
    "FastAPI": {
        "category": SkillCategory.FRAMEWORK,
        "aliases": ["fast-api", "fastapi framework"],
        "prerequisites": ["Python"],
        "description": "High-performance asynchronous Python web API framework based on Starlette and Pydantic.",
    },
    "Django": {
        "category": SkillCategory.FRAMEWORK,
        "aliases": ["django rest framework", "drf"],
        "prerequisites": ["Python", "SQL"],
        "description": "High-level batteries-included Python web framework.",
    },
    "Node.js": {
        "category": SkillCategory.FRAMEWORK,
        "aliases": ["nodejs", "node"],
        "prerequisites": ["JavaScript"],
        "description": "Asynchronous event-driven JavaScript runtime environment.",
    },
    "Express.js": {
        "category": SkillCategory.FRAMEWORK,
        "aliases": ["express", "expressjs"],
        "prerequisites": ["Node.js"],
        "description": "Fast, unopinionated, minimalist web framework for Node.js.",
    },
    "Spring Boot": {
        "category": SkillCategory.FRAMEWORK,
        "aliases": ["spring", "springboot"],
        "prerequisites": ["Java"],
        "description": "Opinionated enterprise application framework for Java microservices.",
    },
    "Tailwind CSS": {
        "category": SkillCategory.FRAMEWORK,
        "aliases": ["tailwindcss", "tailwind"],
        "prerequisites": ["HTML/CSS"],
        "description": "Utility-first CSS framework for rapid responsive user interface styling.",
    },

    # Databases
    "PostgreSQL": {
        "category": SkillCategory.DATABASE,
        "aliases": ["postgres", "psql"],
        "prerequisites": ["SQL"],
        "description": "Advanced open-source object-relational database system with strong ACID compliance.",
    },
    "MySQL": {
        "category": SkillCategory.DATABASE,
        "aliases": ["mariadb"],
        "prerequisites": ["SQL"],
        "description": "Widely deployed relational database management system.",
    },
    "MongoDB": {
        "category": SkillCategory.DATABASE,
        "aliases": ["mongo", "documentdb"],
        "prerequisites": [],
        "description": "Document-oriented NoSQL database storing JSON-like documents.",
    },
    "Redis": {
        "category": SkillCategory.DATABASE,
        "aliases": ["redis cache"],
        "prerequisites": [],
        "description": "In-memory key-value data store used for caching, pub/sub, and session management.",
    },

    # Cloud & DevOps
    "Docker": {
        "category": SkillCategory.CLOUD_DEVOPS,
        "aliases": ["docker containers", "containerization"],
        "prerequisites": [],
        "description": "Platform for automating containerized software packaging and distribution.",
    },
    "Kubernetes": {
        "category": SkillCategory.CLOUD_DEVOPS,
        "aliases": ["k8s"],
        "prerequisites": ["Docker"],
        "description": "Production container orchestration system for automating application scaling and management.",
    },
    "AWS": {
        "category": SkillCategory.CLOUD_DEVOPS,
        "aliases": ["amazon web services", "ec2", "s3", "lambda"],
        "prerequisites": [],
        "description": "Leading comprehensive cloud infrastructure platform.",
    },
    "CI/CD": {
        "category": SkillCategory.CLOUD_DEVOPS,
        "aliases": ["continuous integration", "github actions", "gitlab ci", "jenkins"],
        "prerequisites": ["Git"],
        "description": "Automated build, test, and release delivery pipelines.",
    },
    "Git": {
        "category": SkillCategory.TOOLS,
        "aliases": ["github", "gitlab", "version control"],
        "prerequisites": [],
        "description": "Distributed version control system for tracking software changes.",
    },
    "Linux": {
        "category": SkillCategory.TOOLS,
        "aliases": ["bash", "shell scripting", "ubuntu"],
        "prerequisites": [],
        "description": "Open-source Unix-like operating system foundation for cloud servers and containers.",
    },

    # AI & Machine Learning
    "Machine Learning": {
        "category": SkillCategory.AI_ML,
        "aliases": ["ml", "supervised learning", "unsupervised learning"],
        "prerequisites": ["Python", "Mathematics & Statistics"],
        "description": "Algorithmic modeling enabling computers to learn patterns from data.",
    },
    "PyTorch": {
        "category": SkillCategory.AI_ML,
        "aliases": ["torch"],
        "prerequisites": ["Python", "Machine Learning"],
        "description": "Leading dynamic deep learning framework for research and scalable production models.",
    },
    "TensorFlow": {
        "category": SkillCategory.AI_ML,
        "aliases": ["tf", "keras"],
        "prerequisites": ["Python", "Machine Learning"],
        "description": "End-to-end open-source machine learning platform from Google.",
    },
    "Scikit-Learn": {
        "category": SkillCategory.AI_ML,
        "aliases": ["sklearn"],
        "prerequisites": ["Python"],
        "description": "Standard Python library for classical machine learning and statistical modeling.",
    },
    "Large Language Models (LLMs)": {
        "category": SkillCategory.AI_ML,
        "aliases": ["llm", "generative ai", "genai", "prompt engineering", "langchain", "llamaindex", "rag"],
        "prerequisites": ["Python", "Machine Learning"],
        "description": "Foundation transformer models, retrieval-augmented generation (RAG), and agentic workflows.",
    },
    "Pandas": {
        "category": SkillCategory.AI_ML,
        "aliases": ["pandas dataframe"],
        "prerequisites": ["Python"],
        "description": "Fast, flexible data manipulation and analysis library for Python.",
    },
    "NumPy": {
        "category": SkillCategory.AI_ML,
        "aliases": ["numpy arrays"],
        "prerequisites": ["Python"],
        "description": "Fundamental package for scientific computing with multi-dimensional arrays.",
    },

    # Data Engineering
    "Apache Spark": {
        "category": SkillCategory.DATA_ENGINEERING,
        "aliases": ["spark", "pyspark"],
        "prerequisites": ["Python", "SQL"],
        "description": "Unified analytics engine for large-scale distributed data processing.",
    },
    "Data Warehousing": {
        "category": SkillCategory.DATA_ENGINEERING,
        "aliases": ["snowflake", "bigquery", "redshift"],
        "prerequisites": ["SQL"],
        "description": "Architectures and column-store repositories for analytical reporting and OLAP.",
    },
    "Data Modeling": {
        "category": SkillCategory.DATA_ENGINEERING,
        "aliases": ["dimensional modeling", "star schema", "normalization"],
        "prerequisites": ["SQL"],
        "description": "Structuring structured and semi-structured schemas for performance and integrity.",
    },

    # Quality Assurance & Testing
    "Unit Testing": {
        "category": SkillCategory.TESTING_QA,
        "aliases": ["pytest", "jest", "vitest", "junit", "tdd"],
        "prerequisites": [],
        "description": "Automated verification of individual software units and components.",
    },
    "End-to-End Testing": {
        "category": SkillCategory.TESTING_QA,
        "aliases": ["e2e testing", "playwright", "cypress", "selenium"],
        "prerequisites": ["Unit Testing"],
        "description": "Simulating end-user interaction workflows across integrated web environments.",
    },

    # Architecture & Soft Skills
    "System Design": {
        "category": SkillCategory.SYSTEM_DESIGN,
        "aliases": ["software architecture", "microservices", "distributed systems", "rest api design"],
        "prerequisites": [],
        "description": "Designing scalable, fault-tolerant, and maintainable software architectures.",
    },
    "Cybersecurity Fundamentals": {
        "category": SkillCategory.SECURITY,
        "aliases": ["owasp", "network security", "vulnerability assessment", "iam", "encryption"],
        "prerequisites": ["Linux"],
        "description": "Principles of safeguarding information systems, networks, and data integrity.",
    },
}

# Inverted index for normalized lookup
ALIAS_TO_CANONICAL: dict[str, str] = {}
for canonical, data in SKILL_TAXONOMY.items():
    ALIAS_TO_CANONICAL[canonical.lower()] = canonical
    for alias in data.get("aliases", []):
        ALIAS_TO_CANONICAL[alias.lower()] = canonical


def normalize_skill_name(raw_name: str) -> str:
    """Normalize raw skill or alias to canonical taxonomy name."""
    cleaned = raw_name.strip().lower()
    if cleaned in ALIAS_TO_CANONICAL:
        return ALIAS_TO_CANONICAL[cleaned]
    # Check simple title casing fallback
    for canonical in SKILL_TAXONOMY:
        if cleaned == canonical.lower():
            return canonical
    return raw_name.strip()


# 2. Seed 15 Complete Tech Job Roles
SEED_JOB_ROLES: list[JobRole] = [
    JobRole(
        id="role_ai_engineer",
        title="AI Engineer",
        category="Artificial Intelligence",
        description="Builds, deploys, and optimizes scalable AI systems, fine-tunes LLMs, and builds agentic RAG architectures.",
        required_skills=[
            JobSkillRequirement(canonical_name="Python", weight=1.5, is_required=True, description="Primary language for AI pipelines"),
            JobSkillRequirement(canonical_name="PyTorch", weight=1.4, is_required=True, description="Deep learning framework"),
            JobSkillRequirement(canonical_name="Machine Learning", weight=1.3, is_required=True, description="Core statistical modeling"),
            JobSkillRequirement(canonical_name="Large Language Models (LLMs)", weight=1.5, is_required=True, description="Prompting, fine-tuning, RAG"),
            JobSkillRequirement(canonical_name="FastAPI", weight=1.0, is_required=True, description="REST API serving for inference"),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Docker", weight=1.0, is_required=False, description="Containerized model deployment"),
            JobSkillRequirement(canonical_name="PostgreSQL", weight=0.8, is_required=False, description="Vector databases and metadata storage"),
            JobSkillRequirement(canonical_name="CI/CD", weight=0.7, is_required=False, description="Automated model test & build pipelines"),
        ],
        suggested_projects=[
            "Production RAG Knowledge Assistant with hybrid vector search and evaluation metrics",
            "Multi-agent autonomous workflow pipeline utilizing FastAPI and PyTorch",
        ],
    ),
    JobRole(
        id="role_machine_learning_engineer",
        title="Machine Learning Engineer",
        category="Artificial Intelligence",
        description="Bridges data science and production engineering to build resilient training pipelines and low-latency inference.",
        required_skills=[
            JobSkillRequirement(canonical_name="Python", weight=1.5, is_required=True),
            JobSkillRequirement(canonical_name="Machine Learning", weight=1.5, is_required=True),
            JobSkillRequirement(canonical_name="PyTorch", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="Scikit-Learn", weight=1.2, is_required=True),
            JobSkillRequirement(canonical_name="Docker", weight=1.1, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Kubernetes", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="CI/CD", weight=0.9, is_required=False),
            JobSkillRequirement(canonical_name="AWS", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "End-to-end MLOps pipeline with automated model retraining, drift monitoring, and Dockerized inference",
        ],
    ),
    JobRole(
        id="role_data_scientist",
        title="Data Scientist",
        category="Data & Analytics",
        description="Applies statistical rigor, predictive modeling, and exploratory analytics to solve business challenges.",
        required_skills=[
            JobSkillRequirement(canonical_name="Python", weight=1.5, is_required=True),
            JobSkillRequirement(canonical_name="SQL", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="Pandas", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="Machine Learning", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="Scikit-Learn", weight=1.2, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="NumPy", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="PostgreSQL", weight=0.8, is_required=False),
            JobSkillRequirement(canonical_name="Large Language Models (LLMs)", weight=0.7, is_required=False),
        ],
        suggested_projects=[
            "Customer lifetime value & churn prediction model with detailed interpretability dashboards",
        ],
    ),
    JobRole(
        id="role_full_stack_developer",
        title="Full-Stack Developer",
        category="Software Engineering",
        description="Designs, implements, and maintains end-to-end web applications across modern frontends, robust APIs, and relational databases.",
        required_skills=[
            JobSkillRequirement(canonical_name="TypeScript", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="React", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="Next.js", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="Node.js", weight=1.2, is_required=True),
            JobSkillRequirement(canonical_name="PostgreSQL", weight=1.2, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Tailwind CSS", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="Docker", weight=0.9, is_required=False),
            JobSkillRequirement(canonical_name="Unit Testing", weight=0.8, is_required=False),
            JobSkillRequirement(canonical_name="Redis", weight=0.7, is_required=False),
        ],
        suggested_projects=[
            "Full-Stack Collaborative SaaS with authentication, Prisma ORM, role-based access control, and dark mode UI",
        ],
    ),
    JobRole(
        id="role_frontend_developer",
        title="Frontend Developer",
        category="Software Engineering",
        description="Crafts high-performance, accessible, and responsive user experiences with modern component architectures.",
        required_skills=[
            JobSkillRequirement(canonical_name="JavaScript", weight=1.5, is_required=True),
            JobSkillRequirement(canonical_name="TypeScript", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="React", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="HTML/CSS", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="Tailwind CSS", weight=1.1, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Next.js", weight=1.1, is_required=False),
            JobSkillRequirement(canonical_name="Unit Testing", weight=0.9, is_required=False),
            JobSkillRequirement(canonical_name="End-to-End Testing", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "Design system component library with Storybook, accessibility WCAG compliance, and Vitest suite",
        ],
    ),
    JobRole(
        id="role_backend_developer",
        title="Backend Developer",
        category="Software Engineering",
        description="Engineers secure, scalable APIs, microservices, database schemas, and background job processing pipelines.",
        required_skills=[
            JobSkillRequirement(canonical_name="Python", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="FastAPI", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="PostgreSQL", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="SQL", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="System Design", weight=1.2, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Redis", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="Docker", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="CI/CD", weight=0.8, is_required=False),
            JobSkillRequirement(canonical_name="Unit Testing", weight=0.9, is_required=False),
        ],
        suggested_projects=[
            "Distributed rate-limited microservices API with Redis caching, PostgreSQL persistence, and OpenAPI contract validation",
        ],
    ),
    JobRole(
        id="role_software_engineer",
        title="Software Engineer",
        category="Software Engineering",
        description="Generalist software engineer building robust systems, algorithms, APIs, and automated test suites.",
        required_skills=[
            JobSkillRequirement(canonical_name="Python", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="SQL", weight=1.2, is_required=True),
            JobSkillRequirement(canonical_name="Git", weight=1.2, is_required=True),
            JobSkillRequirement(canonical_name="System Design", weight=1.2, is_required=True),
            JobSkillRequirement(canonical_name="Unit Testing", weight=1.1, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Docker", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="TypeScript", weight=0.9, is_required=False),
            JobSkillRequirement(canonical_name="CI/CD", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "High-throughput transactional order management engine with comprehensive test coverage and documentation",
        ],
    ),
    JobRole(
        id="role_python_developer",
        title="Python Developer",
        category="Software Engineering",
        description="Develops Python enterprise backends, data automation scripts, asynchronous services, and robust APIs.",
        required_skills=[
            JobSkillRequirement(canonical_name="Python", weight=1.5, is_required=True),
            JobSkillRequirement(canonical_name="FastAPI", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="SQL", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="PostgreSQL", weight=1.2, is_required=True),
            JobSkillRequirement(canonical_name="Unit Testing", weight=1.1, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Docker", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="Redis", weight=0.9, is_required=False),
            JobSkillRequirement(canonical_name="Linux", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "Asynchronous data processing service using Python asyncio, FastAPI, PostgreSQL, and Pytest",
        ],
    ),
    JobRole(
        id="role_data_analyst",
        title="Data Analyst",
        category="Data & Analytics",
        description="Transforms raw enterprise datasets into actionable insights, executive dashboards, and statistical summaries.",
        required_skills=[
            JobSkillRequirement(canonical_name="SQL", weight=1.5, is_required=True),
            JobSkillRequirement(canonical_name="Python", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="Pandas", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="Data Modeling", weight=1.2, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="PostgreSQL", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="NumPy", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "Executive business intelligence pipeline analyzing sales performance, retention cohorts, and revenue forecasts",
        ],
    ),
    JobRole(
        id="role_data_engineer",
        title="Data Engineer",
        category="Data & Analytics",
        description="Architects resilient distributed data pipelines, batch/streaming ETL jobs, and cloud data warehouses.",
        required_skills=[
            JobSkillRequirement(canonical_name="Python", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="SQL", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="Apache Spark", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="PostgreSQL", weight=1.2, is_required=True),
            JobSkillRequirement(canonical_name="Data Warehousing", weight=1.2, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Docker", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="AWS", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="CI/CD", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "Scalable Lakehouse ingestion pipeline ingesting streaming event logs into partitioned Parquet tables using PySpark",
        ],
    ),
    JobRole(
        id="role_devops_engineer",
        title="DevOps Engineer",
        category="Infrastructure & Cloud",
        description="Automates infrastructure provisioning, enforces continuous integration/delivery, and ensures high availability.",
        required_skills=[
            JobSkillRequirement(canonical_name="Docker", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="Kubernetes", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="CI/CD", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="Linux", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="AWS", weight=1.2, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Python", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="Go", weight=0.8, is_required=False),
            JobSkillRequirement(canonical_name="Cybersecurity Fundamentals", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "GitOps infrastructure deployment with automated Helm charts, Kubernetes ingress, and GitHub Actions",
        ],
    ),
    JobRole(
        id="role_cloud_engineer",
        title="Cloud Engineer",
        category="Infrastructure & Cloud",
        description="Architects, secures, and maintains cloud solutions across compute, networking, identity, and storage.",
        required_skills=[
            JobSkillRequirement(canonical_name="AWS", weight=1.5, is_required=True),
            JobSkillRequirement(canonical_name="Linux", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="Docker", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="CI/CD", weight=1.2, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Kubernetes", weight=1.1, is_required=False),
            JobSkillRequirement(canonical_name="Python", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="Cybersecurity Fundamentals", weight=0.9, is_required=False),
        ],
        suggested_projects=[
            "Multi-region highly available serverless architecture utilizing AWS Lambda, DynamoDB, API Gateway, and CloudFront",
        ],
    ),
    JobRole(
        id="role_cybersecurity_analyst",
        title="Cybersecurity Analyst",
        category="Security",
        description="Protects systems and networks from vulnerabilities, monitors threat surfaces, and implements security controls.",
        required_skills=[
            JobSkillRequirement(canonical_name="Cybersecurity Fundamentals", weight=1.5, is_required=True),
            JobSkillRequirement(canonical_name="Linux", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="Python", weight=1.2, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Docker", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="AWS", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="SQL", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "Automated vulnerability scanning and threat assessment framework for cloud-native applications",
        ],
    ),
    JobRole(
        id="role_qa_automation_engineer",
        title="QA Automation Engineer",
        category="Quality Engineering",
        description="Designs automated test suites, end-to-end regression frameworks, and quality gates in deployment pipelines.",
        required_skills=[
            JobSkillRequirement(canonical_name="Unit Testing", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="End-to-End Testing", weight=1.5, is_required=True),
            JobSkillRequirement(canonical_name="Python", weight=1.3, is_required=True),
            JobSkillRequirement(canonical_name="CI/CD", weight=1.2, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="JavaScript", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="Docker", weight=0.9, is_required=False),
            JobSkillRequirement(canonical_name="SQL", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "Parallelized Playwright E2E testing framework integrated with GitHub Actions and automated Slack reporting",
        ],
    ),
    JobRole(
        id="role_mobile_app_developer",
        title="Mobile App Developer",
        category="Software Engineering",
        description="Builds cross-platform or native mobile applications with smooth gestures, offline caching, and responsive UI.",
        required_skills=[
            JobSkillRequirement(canonical_name="React", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="TypeScript", weight=1.4, is_required=True),
            JobSkillRequirement(canonical_name="JavaScript", weight=1.3, is_required=True),
        ],
        preferred_skills=[
            JobSkillRequirement(canonical_name="Unit Testing", weight=1.0, is_required=False),
            JobSkillRequirement(canonical_name="PostgreSQL", weight=0.8, is_required=False),
        ],
        suggested_projects=[
            "Cross-platform React Native task synchronization app with offline SQLite persistence and biometric authentication",
        ],
    ),
]

# 3. Seed Verified Curated Learning Resources (Official Docs, Standard Courses)
SEED_LEARNING_RESOURCES: list[LearningResource] = [
    # Python
    LearningResource(
        id="res_python_docs",
        title="Python Official Tutorial & Language Reference",
        provider="Python Software Foundation",
        skill_tags=["Python"],
        resource_type="Official Documentation",
        difficulty="Beginner",
        duration_hours=20,
        price_category="Free",
        url="https://docs.python.org/3/tutorial/",
        verified=True,
    ),
    LearningResource(
        id="res_fastapi_docs",
        title="FastAPI Official Tutorial - User Guide",
        provider="FastAPI / Tiangolo",
        skill_tags=["FastAPI", "Python"],
        resource_type="Official Documentation",
        difficulty="Intermediate",
        duration_hours=15,
        price_category="Free",
        url="https://fastapi.tiangolo.com/tutorial/",
        verified=True,
    ),
    # TypeScript & JavaScript
    LearningResource(
        id="res_mdn_js",
        title="MDN Web Docs: JavaScript Guide",
        provider="Mozilla Developer Network",
        skill_tags=["JavaScript"],
        resource_type="Official Documentation",
        difficulty="Beginner",
        duration_hours=25,
        price_category="Free",
        url="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        verified=True,
    ),
    LearningResource(
        id="res_ts_handbook",
        title="The TypeScript Handbook",
        provider="Microsoft TypeScript Team",
        skill_tags=["TypeScript", "JavaScript"],
        resource_type="Official Documentation",
        difficulty="Intermediate",
        duration_hours=15,
        price_category="Free",
        url="https://www.typescriptlang.org/docs/handbook/intro.html",
        verified=True,
    ),
    # React & Next.js
    LearningResource(
        id="res_react_dev",
        title="React Official Documentation: Learn React",
        provider="Meta Open Source",
        skill_tags=["React", "JavaScript"],
        resource_type="Official Documentation",
        difficulty="Beginner",
        duration_hours=20,
        price_category="Free",
        url="https://react.dev/learn",
        verified=True,
    ),
    LearningResource(
        id="res_nextjs_learn",
        title="Next.js App Router Foundations",
        provider="Vercel",
        skill_tags=["Next.js", "React", "TypeScript"],
        resource_type="Interactive Course",
        difficulty="Intermediate",
        duration_hours=16,
        price_category="Free",
        url="https://nextjs.org/learn",
        verified=True,
    ),
    LearningResource(
        id="res_tailwind_docs",
        title="Tailwind CSS Documentation & Core Concepts",
        provider="Tailwind Labs",
        skill_tags=["Tailwind CSS", "HTML/CSS"],
        resource_type="Official Documentation",
        difficulty="Beginner",
        duration_hours=10,
        price_category="Free",
        url="https://tailwindcss.com/docs",
        verified=True,
    ),
    # Databases
    LearningResource(
        id="res_postgres_tutorial",
        title="PostgreSQL Official Documentation & Architecture",
        provider="The PostgreSQL Global Development Group",
        skill_tags=["PostgreSQL", "SQL"],
        resource_type="Official Documentation",
        difficulty="Intermediate",
        duration_hours=25,
        price_category="Free",
        url="https://www.postgresql.org/docs/current/tutorial.html",
        verified=True,
    ),
    LearningResource(
        id="res_sqlzoo",
        title="SQLZoo Interactive SQL Practice Platform",
        provider="SQLZoo",
        skill_tags=["SQL"],
        resource_type="Interactive Practice",
        difficulty="Beginner",
        duration_hours=12,
        price_category="Free",
        url="https://sqlzoo.net/",
        verified=True,
    ),
    LearningResource(
        id="res_redis_university",
        title="Redis University: RU101 Introduction to Redis Data Structures",
        provider="Redis Inc.",
        skill_tags=["Redis"],
        resource_type="Online Course",
        difficulty="Intermediate",
        duration_hours=10,
        price_category="Free",
        url="https://university.redis.com/",
        verified=True,
    ),
    # AI & ML
    LearningResource(
        id="res_pytorch_tutorials",
        title="Deep Learning with PyTorch: 60 Minute Blitz & Tutorials",
        provider="PyTorch Foundation",
        skill_tags=["PyTorch", "Machine Learning", "Python"],
        resource_type="Official Documentation",
        difficulty="Intermediate",
        duration_hours=20,
        price_category="Free",
        url="https://pytorch.org/tutorials/",
        verified=True,
    ),
    LearningResource(
        id="res_sklearn_docs",
        title="Scikit-Learn User Guide: Machine Learning in Python",
        provider="Scikit-Learn Development Team",
        skill_tags=["Scikit-Learn", "Machine Learning", "Python"],
        resource_type="Official Documentation",
        difficulty="Intermediate",
        duration_hours=18,
        price_category="Free",
        url="https://scikit-learn.org/stable/user_guide.html",
        verified=True,
    ),
    LearningResource(
        id="res_deeplearning_rag",
        title="Building Systems with the ChatGPT API & RAG Architectures",
        provider="DeepLearning.AI",
        skill_tags=["Large Language Models (LLMs)", "AI_ML"],
        resource_type="Online Course",
        difficulty="Intermediate",
        duration_hours=12,
        price_category="Free",
        url="https://www.deeplearning.ai/short-courses/",
        verified=True,
    ),
    LearningResource(
        id="res_pandas_docs",
        title="10 Minutes to Pandas & User Guide",
        provider="Pandas Development Team",
        skill_tags=["Pandas", "Python"],
        resource_type="Official Documentation",
        difficulty="Beginner",
        duration_hours=10,
        price_category="Free",
        url="https://pandas.pydata.org/docs/user_guide/index.html",
        verified=True,
    ),
    # Cloud & DevOps
    LearningResource(
        id="res_docker_getstarted",
        title="Docker Official Get Started & Best Practices",
        provider="Docker Documentation",
        skill_tags=["Docker", "Linux"],
        resource_type="Official Documentation",
        difficulty="Beginner",
        duration_hours=14,
        price_category="Free",
        url="https://docs.docker.com/get-started/",
        verified=True,
    ),
    LearningResource(
        id="res_k8s_basics",
        title="Kubernetes Basics & Interactive Tutorials",
        provider="Kubernetes / CNCF",
        skill_tags=["Kubernetes", "Docker"],
        resource_type="Interactive Tutorial",
        difficulty="Intermediate",
        duration_hours=20,
        price_category="Free",
        url="https://kubernetes.io/docs/tutorials/kubernetes-basics/",
        verified=True,
    ),
    LearningResource(
        id="res_github_actions",
        title="GitHub Actions: Quickstart & Workflow Automation",
        provider="GitHub Docs",
        skill_tags=["CI/CD", "Git"],
        resource_type="Official Documentation",
        difficulty="Intermediate",
        duration_hours=10,
        price_category="Free",
        url="https://docs.github.com/en/actions/quickstart",
        verified=True,
    ),
    LearningResource(
        id="res_aws_rampup",
        title="AWS Cloud Practitioner Ramp-Up Guide & Whitepapers",
        provider="Amazon Web Services",
        skill_tags=["AWS", "Cloud_Devops"],
        resource_type="Official Documentation",
        difficulty="Beginner",
        duration_hours=25,
        price_category="Free",
        url="https://aws.amazon.com/training/ramp-up-guides/",
        verified=True,
    ),
    # Testing & Architecture
    LearningResource(
        id="res_pytest_docs",
        title="Pytest Documentation: Simple Powerful Testing with Python",
        provider="Holger Krekel and pytest-dev",
        skill_tags=["Unit Testing", "Python"],
        resource_type="Official Documentation",
        difficulty="Beginner",
        duration_hours=12,
        price_category="Free",
        url="https://docs.pytest.org/en/stable/",
        verified=True,
    ),
    LearningResource(
        id="res_playwright_docs",
        title="Playwright: Fast and Reliable End-to-End Testing",
        provider="Microsoft",
        skill_tags=["End-to-End Testing", "TypeScript", "Python"],
        resource_type="Official Documentation",
        difficulty="Intermediate",
        duration_hours=14,
        price_category="Free",
        url="https://playwright.dev/docs/intro",
        verified=True,
    ),
]
