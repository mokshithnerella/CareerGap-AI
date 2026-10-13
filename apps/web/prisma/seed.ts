import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CareerGap AI database...");

  // 1. Seed Default Demo User
  const demoUser = await prisma.userProfile.upsert({
    where: { email: "alex.chen@university.edu" },
    update: {},
    create: {
      email: "alex.chen@university.edu",
      fullName: "Alex Chen",
      careerStage: "Senior Undergraduate / Aspiring AI Engineer",
      weeklyStudyHours: 12,
      targetTimeline: 10,
      learningPreference: "hands_on_projects",
    },
  });
  console.log(`Demo User initialized: ${demoUser.fullName} (${demoUser.id})`);

  // 2. Seed 15 Job Roles
  const roles = [
    {
      id: "role_ai_engineer",
      title: "AI Engineer",
      category: "Artificial Intelligence",
      description: "Builds, deploys, and optimizes scalable AI systems, fine-tunes LLMs, and builds agentic RAG architectures.",
      requirements: [
        { canonicalName: "Python", isRequired: true, weight: 1.5, category: "programming_language" },
        { canonicalName: "PyTorch", isRequired: true, weight: 1.4, category: "ai_ml" },
        { canonicalName: "Machine Learning", isRequired: true, weight: 1.3, category: "ai_ml" },
        { canonicalName: "Large Language Models (LLMs)", isRequired: true, weight: 1.5, category: "ai_ml" },
        { canonicalName: "FastAPI", isRequired: true, weight: 1.0, category: "framework" },
        { canonicalName: "Docker", isRequired: false, weight: 1.0, category: "cloud_devops" },
        { canonicalName: "PostgreSQL", isRequired: false, weight: 0.8, category: "database" },
      ],
    },
    {
      id: "role_full_stack_developer",
      title: "Full-Stack Developer",
      category: "Software Engineering",
      description: "Designs, implements, and maintains end-to-end web applications across modern frontends, robust APIs, and relational databases.",
      requirements: [
        { canonicalName: "TypeScript", isRequired: true, weight: 1.4, category: "programming_language" },
        { canonicalName: "React", isRequired: true, weight: 1.4, category: "framework" },
        { canonicalName: "Next.js", isRequired: true, weight: 1.3, category: "framework" },
        { canonicalName: "Node.js", isRequired: true, weight: 1.2, category: "framework" },
        { canonicalName: "PostgreSQL", isRequired: true, weight: 1.2, category: "database" },
        { canonicalName: "Tailwind CSS", isRequired: false, weight: 1.0, category: "framework" },
        { canonicalName: "Docker", isRequired: false, weight: 0.9, category: "cloud_devops" },
      ],
    },
    {
      id: "role_data_scientist",
      title: "Data Scientist",
      category: "Data & Analytics",
      description: "Applies statistical rigor, predictive modeling, and exploratory analytics to solve business challenges.",
      requirements: [
        { canonicalName: "Python", isRequired: true, weight: 1.5, category: "programming_language" },
        { canonicalName: "SQL", isRequired: true, weight: 1.4, category: "programming_language" },
        { canonicalName: "Pandas", isRequired: true, weight: 1.3, category: "ai_ml" },
        { canonicalName: "Machine Learning", isRequired: true, weight: 1.3, category: "ai_ml" },
        { canonicalName: "Scikit-Learn", isRequired: true, weight: 1.2, category: "ai_ml" },
        { canonicalName: "NumPy", isRequired: false, weight: 1.0, category: "ai_ml" },
      ],
    },
    {
      id: "role_backend_developer",
      title: "Backend Developer",
      category: "Software Engineering",
      description: "Engineers secure, scalable APIs, microservices, database schemas, and background job processing pipelines.",
      requirements: [
        { canonicalName: "Python", isRequired: true, weight: 1.4, category: "programming_language" },
        { canonicalName: "FastAPI", isRequired: true, weight: 1.3, category: "framework" },
        { canonicalName: "PostgreSQL", isRequired: true, weight: 1.3, category: "database" },
        { canonicalName: "SQL", isRequired: true, weight: 1.3, category: "programming_language" },
        { canonicalName: "System Design", isRequired: true, weight: 1.2, category: "system_design" },
        { canonicalName: "Redis", isRequired: false, weight: 1.0, category: "database" },
        { canonicalName: "Docker", isRequired: false, weight: 1.0, category: "cloud_devops" },
      ],
    },
    {
      id: "role_frontend_developer",
      title: "Frontend Developer",
      category: "Software Engineering",
      description: "Crafts high-performance, accessible, and responsive user experiences with modern component architectures.",
      requirements: [
        { canonicalName: "JavaScript", isRequired: true, weight: 1.5, category: "programming_language" },
        { canonicalName: "TypeScript", isRequired: true, weight: 1.4, category: "programming_language" },
        { canonicalName: "React", isRequired: true, weight: 1.4, category: "framework" },
        { canonicalName: "HTML/CSS", isRequired: true, weight: 1.3, category: "programming_language" },
        { canonicalName: "Tailwind CSS", isRequired: true, weight: 1.1, category: "framework" },
        { canonicalName: "Next.js", isRequired: false, weight: 1.1, category: "framework" },
      ],
    },
    {
      id: "role_devops_engineer",
      title: "DevOps Engineer",
      category: "Infrastructure & Cloud",
      description: "Automates infrastructure provisioning, enforces continuous integration/delivery, and ensures high availability.",
      requirements: [
        { canonicalName: "Docker", isRequired: true, weight: 1.4, category: "cloud_devops" },
        { canonicalName: "Kubernetes", isRequired: true, weight: 1.4, category: "cloud_devops" },
        { canonicalName: "CI/CD", isRequired: true, weight: 1.3, category: "cloud_devops" },
        { canonicalName: "Linux", isRequired: true, weight: 1.3, category: "tools" },
        { canonicalName: "AWS", isRequired: true, weight: 1.2, category: "cloud_devops" },
      ],
    },
    {
      id: "role_machine_learning_engineer",
      title: "Machine Learning Engineer",
      category: "Artificial Intelligence",
      description: "Bridges data science and production engineering to build resilient training pipelines and low-latency inference.",
      requirements: [
        { canonicalName: "Python", isRequired: true, weight: 1.5, category: "programming_language" },
        { canonicalName: "Machine Learning", isRequired: true, weight: 1.5, category: "ai_ml" },
        { canonicalName: "PyTorch", isRequired: true, weight: 1.3, category: "ai_ml" },
        { canonicalName: "Docker", isRequired: true, weight: 1.1, category: "cloud_devops" },
      ],
    },
    {
      id: "role_software_engineer",
      title: "Software Engineer",
      category: "Software Engineering",
      description: "Generalist software engineer building robust systems, algorithms, APIs, and automated test suites.",
      requirements: [
        { canonicalName: "Python", isRequired: true, weight: 1.3, category: "programming_language" },
        { canonicalName: "SQL", isRequired: true, weight: 1.2, category: "programming_language" },
        { canonicalName: "Git", isRequired: true, weight: 1.2, category: "tools" },
        { canonicalName: "System Design", isRequired: true, weight: 1.2, category: "system_design" },
      ],
    },
    {
      id: "role_python_developer",
      title: "Python Developer",
      category: "Software Engineering",
      description: "Develops Python enterprise backends, data automation scripts, asynchronous services, and robust APIs.",
      requirements: [
        { canonicalName: "Python", isRequired: true, weight: 1.5, category: "programming_language" },
        { canonicalName: "FastAPI", isRequired: true, weight: 1.3, category: "framework" },
        { canonicalName: "SQL", isRequired: true, weight: 1.3, category: "programming_language" },
        { canonicalName: "PostgreSQL", isRequired: true, weight: 1.2, category: "database" },
      ],
    },
    {
      id: "role_data_analyst",
      title: "Data Analyst",
      category: "Data & Analytics",
      description: "Transforms raw enterprise datasets into actionable insights, executive dashboards, and statistical summaries.",
      requirements: [
        { canonicalName: "SQL", isRequired: true, weight: 1.5, category: "programming_language" },
        { canonicalName: "Python", isRequired: true, weight: 1.3, category: "programming_language" },
        { canonicalName: "Pandas", isRequired: true, weight: 1.3, category: "ai_ml" },
      ],
    },
    {
      id: "role_data_engineer",
      title: "Data Engineer",
      category: "Data & Analytics",
      description: "Architects resilient distributed data pipelines, batch/streaming ETL jobs, and cloud data warehouses.",
      requirements: [
        { canonicalName: "Python", isRequired: true, weight: 1.4, category: "programming_language" },
        { canonicalName: "SQL", isRequired: true, weight: 1.4, category: "programming_language" },
        { canonicalName: "Apache Spark", isRequired: true, weight: 1.4, category: "data_engineering" },
        { canonicalName: "PostgreSQL", isRequired: true, weight: 1.2, category: "database" },
      ],
    },
    {
      id: "role_cloud_engineer",
      title: "Cloud Engineer",
      category: "Infrastructure & Cloud",
      description: "Architects, secures, and maintains cloud solutions across compute, networking, identity, and storage.",
      requirements: [
        { canonicalName: "AWS", isRequired: true, weight: 1.5, category: "cloud_devops" },
        { canonicalName: "Linux", isRequired: true, weight: 1.3, category: "tools" },
        { canonicalName: "Docker", isRequired: true, weight: 1.3, category: "cloud_devops" },
        { canonicalName: "CI/CD", isRequired: true, weight: 1.2, category: "cloud_devops" },
      ],
    },
    {
      id: "role_cybersecurity_analyst",
      title: "Cybersecurity Analyst",
      category: "Security",
      description: "Protects systems and networks from vulnerabilities, monitors threat surfaces, and implements security controls.",
      requirements: [
        { canonicalName: "Cybersecurity Fundamentals", isRequired: true, weight: 1.5, category: "security" },
        { canonicalName: "Linux", isRequired: true, weight: 1.4, category: "tools" },
        { canonicalName: "Python", isRequired: true, weight: 1.2, category: "programming_language" },
      ],
    },
    {
      id: "role_qa_automation_engineer",
      title: "QA Automation Engineer",
      category: "Quality Engineering",
      description: "Designs automated test suites, end-to-end regression frameworks, and quality gates in deployment pipelines.",
      requirements: [
        { canonicalName: "Unit Testing", isRequired: true, weight: 1.4, category: "testing_qa" },
        { canonicalName: "End-to-End Testing", isRequired: true, weight: 1.5, category: "testing_qa" },
        { canonicalName: "Python", isRequired: true, weight: 1.3, category: "programming_language" },
      ],
    },
    {
      id: "role_mobile_app_developer",
      title: "Mobile App Developer",
      category: "Software Engineering",
      description: "Builds cross-platform or native mobile applications with smooth gestures, offline caching, and responsive UI.",
      requirements: [
        { canonicalName: "React", isRequired: true, weight: 1.4, category: "framework" },
        { canonicalName: "TypeScript", isRequired: true, weight: 1.4, category: "programming_language" },
        { canonicalName: "JavaScript", isRequired: true, weight: 1.3, category: "programming_language" },
      ],
    },
  ];

  for (const roleData of roles) {
    const role = await prisma.jobRole.upsert({
      where: { id: roleData.id },
      update: {
        title: roleData.title,
        category: roleData.category,
        description: roleData.description,
      },
      create: {
        id: roleData.id,
        title: roleData.title,
        category: roleData.category,
        description: roleData.description,
      },
    });

    for (const req of roleData.requirements) {
      await prisma.jobSkillRequirement.create({
        data: {
          roleId: role.id,
          canonicalName: req.canonicalName,
          category: req.category,
          isRequired: req.isRequired,
          weight: req.weight,
        },
      });
    }
  }
  console.log(`Successfully seeded ${roles.length} Job Roles and Requirements.`);

  // 3. Seed Verified Curated Learning Resources
  const resources = [
    {
      id: "res_python_docs",
      title: "Python Official Tutorial & Language Reference",
      provider: "Python Software Foundation",
      skillTags: "Python",
      resourceType: "Official Documentation",
      difficulty: "Beginner",
      durationHours: 20,
      priceCategory: "Free",
      url: "https://docs.python.org/3/tutorial/",
    },
    {
      id: "res_fastapi_docs",
      title: "FastAPI Official Tutorial - User Guide",
      provider: "FastAPI / Tiangolo",
      skillTags: "FastAPI, Python",
      resourceType: "Official Documentation",
      difficulty: "Intermediate",
      durationHours: 15,
      priceCategory: "Free",
      url: "https://fastapi.tiangolo.com/tutorial/",
    },
    {
      id: "res_mdn_js",
      title: "MDN Web Docs: JavaScript Guide",
      provider: "Mozilla Developer Network",
      skillTags: "JavaScript",
      resourceType: "Official Documentation",
      difficulty: "Beginner",
      durationHours: 25,
      priceCategory: "Free",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    },
    {
      id: "res_ts_handbook",
      title: "The TypeScript Handbook",
      provider: "Microsoft TypeScript Team",
      skillTags: "TypeScript, JavaScript",
      resourceType: "Official Documentation",
      difficulty: "Intermediate",
      durationHours: 15,
      priceCategory: "Free",
      url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    },
    {
      id: "res_react_dev",
      title: "React Official Documentation: Learn React",
      provider: "Meta Open Source",
      skillTags: "React, JavaScript",
      resourceType: "Official Documentation",
      difficulty: "Beginner",
      durationHours: 20,
      priceCategory: "Free",
      url: "https://react.dev/learn",
    },
    {
      id: "res_pytorch_tutorials",
      title: "Deep Learning with PyTorch: 60 Minute Blitz & Tutorials",
      provider: "PyTorch Foundation",
      skillTags: "PyTorch, Machine Learning, Python",
      resourceType: "Official Documentation",
      difficulty: "Intermediate",
      durationHours: 20,
      priceCategory: "Free",
      url: "https://pytorch.org/tutorials/",
    },
    {
      id: "res_postgres_tutorial",
      title: "PostgreSQL Official Documentation & Architecture",
      provider: "The PostgreSQL Global Development Group",
      skillTags: "PostgreSQL, SQL",
      resourceType: "Official Documentation",
      difficulty: "Intermediate",
      durationHours: 25,
      priceCategory: "Free",
      url: "https://www.postgresql.org/docs/current/tutorial.html",
    },
  ];

  for (const res of resources) {
    await prisma.learningResource.upsert({
      where: { id: res.id },
      update: {},
      create: {
        id: res.id,
        title: res.title,
        provider: res.provider,
        skillTags: res.skillTags,
        resourceType: res.resourceType,
        difficulty: res.difficulty,
        durationHours: res.durationHours,
        priceCategory: res.priceCategory,
        url: res.url,
        verified: true,
      },
    });
  }
  console.log(`Successfully seeded ${resources.length} Curated Learning Resources.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
