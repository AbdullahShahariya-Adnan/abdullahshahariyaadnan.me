-- Seed data — run after schema.sql
-- Replace the password hash below first: cd backend && npm run hash-password -- yourpassword
USE portfolio_db;

INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2b$10$REPLACE_WITH_GENERATED_HASH');

INSERT INTO projects
  (title, tagline, description, long_description, role, duration, tech_stack, features, challenges, github_url, sort_order)
VALUES
  ('Expense Tracker',
   'A full-stack app for tracking spending and understanding where money actually goes.',
   'A full-stack expense management application that lets users track income and expenses, categorize transactions, and monitor spending habits.',
   'Expense Tracker started as a university assignment and grew into a more complete personal finance tool. The backend is built with NestJS and TypeORM on top of MySQL, exposing a REST API for transactions, categories, and analytics. The Angular frontend uses standalone components and a custom dark financial UI designed to make numbers easy to scan at a glance.',
   'University project (individual)',
   '~4 weeks, plus later revisions',
   'Angular,NestJS,MySQL,TypeScript,TypeORM',
   'Transaction CRUD with categorization,Monthly spending analytics and summaries,Custom dark financial UI,REST API with TypeORM entities,Environment-based configuration and CORS setup',
   'Getting TypeORM relations and migrations to behave consistently across environments,Structuring analytics queries to stay fast as transaction volume grows,Keeping the Angular services and NestJS DTOs in sync as the schema evolved',
   'https://github.com/AbdullahShahariya-Adnan',
   1),
  ('LearnTogether',
   'A collaborative learning platform built for a university web programming course.',
   'Educational web platform built for a university web programming project to support collaborative learning and resource sharing.',
   'LearnTogether was built for a web programming course with the goal of giving students a simple place to share notes, resources, and study materials with each other. It uses vanilla HTML, CSS, and JavaScript on the frontend with a SQL backend — a deliberate choice to practice the fundamentals of web development without leaning on a framework.',
   'University project (individual)',
   '~3 weeks',
   'HTML,CSS,JavaScript,SQL',
   'User accounts and authentication,Posting and browsing shared study resources,Search and filtering by subject,Responsive layout with vanilla CSS',
   'Structuring the SQL schema before any frontend existed to make sure the data model actually supported the features,Writing plain JavaScript DOM logic without a framework to manage state,Keeping styling consistent across pages without a CSS framework',
   'https://github.com/AbdullahShahariya-Adnan',
   2);

INSERT INTO skills (category, name, sort_order) VALUES
  ('LANG', 'Python', 1), ('LANG', 'JavaScript', 2), ('LANG', 'Java', 3), ('LANG', 'C++', 4), ('LANG', 'SQL', 5),
  ('WEB', 'Angular', 1), ('WEB', 'NestJS', 2), ('WEB', 'Node.js', 3), ('WEB', 'HTML5', 4), ('WEB', 'CSS3', 5), ('WEB', 'REST APIs', 6),
  ('DB', 'MySQL', 1), ('DB', 'SQL Server', 2),
  ('TOOLS', 'Git', 1), ('TOOLS', 'GitHub', 2), ('TOOLS', 'Linux', 3), ('TOOLS', 'VS Code', 4), ('TOOLS', 'DBeaver', 5), ('TOOLS', 'XAMPP', 6),
  ('SEC', 'Linux Fundamentals', 1), ('SEC', 'Network Fundamentals', 2), ('SEC', 'Basic Penetration Testing', 3), ('SEC', 'TryHackMe', 4);

INSERT INTO education (degree, institution, start_year, end_year, description, sort_order) VALUES
  ('B.Sc. in Computer Science', 'University of Pécs, Hungary', '2023', '2027',
   'Coursework spanning full-stack web development, Linux system administration, and networking fundamentals.', 1);
