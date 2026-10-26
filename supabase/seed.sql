-- Initial content migrated from src/data/agencyData.js.
-- Safe to run repeatedly: existing records (including admin edits) are left
-- untouched. It also creates draft-only reference templates once, never
-- published portfolio work. Run schema.sql first.

begin;

insert into public.services (slug, title, description, capabilities, icon_key, published, sort_order)
values
  ('web-apps', 'Websites & Web Applications', 'Responsive marketing websites and custom web platforms.', array['React', 'Next.js', 'ASP.NET Core']::text[], 'globe-2', true, 10),
  ('business-software', 'Business Software', 'Purpose-built operational systems, dashboards and APIs.', array['.NET', 'SQL Server', 'REST APIs']::text[], 'layers', true, 20),
  ('mobile-apps', 'Mobile Applications', 'Mobile-first product experiences for Android and beyond.', array['Mobile UI', 'API integration', 'Product engineering']::text[], 'smartphone', true, 30),
  ('ai-automation', 'AI & Workflow Automation', 'Assistants, intelligent workflows and practical AI integrations.', array['AI integration', 'Automations', 'Chatbots']::text[], 'bot', true, 40),
  ('full-stack', 'Full-Stack Development', 'Reliable frontends, services and databases built together.', array['MERN', 'Node.js', 'Database design']::text[], 'code-xml', true, 50),
  ('maintenance', 'Maintenance & Modernization', 'Improve, extend and support existing digital products.', array['Refactoring', 'Performance', 'Deployment']::text[], 'wrench', true, 60),
  ('crm-erp', 'CRM & ERP Solutions', 'Organize customers, inventory, operations and team workflows in one connected system.', array['CRM', 'ERP', 'Automation']::text[], 'users-round', true, 70),
  ('ecommerce', 'E-Commerce & Booking', 'Build smooth online storefronts, reservation flows and secure checkout journeys.', array['Online stores', 'Bookings', 'Payments']::text[], 'shopping-bag', true, 80),
  ('product-design', 'Product Strategy & UI/UX', 'Turn ideas into polished wireframes, prototypes and intuitive product interfaces.', array['UX research', 'Figma', 'Prototyping']::text[], 'paintbrush', true, 90),
  ('api-integrations', 'API & Platform Integrations', 'Connect apps, third-party systems, payment providers and business tools.', array['REST APIs', 'Webhooks', 'Integrations']::text[], 'plug-zap', true, 100),
  ('analytics', 'Reporting & Dashboards', 'Make business information easier to act on with tailored reports and dashboards.', array['Analytics', 'Data visualization', 'SQL']::text[], 'bar-chart-3', true, 110),
  ('cloud-devops', 'Cloud, Hosting & DevOps', 'Prepare applications for deployment, hosting, monitoring and ongoing maintenance.', array['Azure', 'VPS', 'CI/CD']::text[], 'cloud', true, 120)
on conflict (slug) do nothing;

insert into public.technologies (slug, label, category, "group", icon_key, published, sort_order)
values
  ('dotnet', 'ASP.NET Core', 'Backend', 'core', 'code-2', true, 10),
  ('react', 'React', 'Frontend', 'core', 'atom', true, 20),
  ('next', 'Next.js', 'Frontend', 'core', 'globe-2', true, 30),
  ('node', 'Node.js', 'Backend', 'core', 'server', true, 40),
  ('mongo', 'MongoDB', 'Database', 'core', 'database', true, 50),
  ('sql', 'SQL Server', 'Database', 'core', 'database', true, 60),
  ('python', 'Python', 'AI / Backend', 'core', 'code-2', true, 70),
  ('fastapi', 'FastAPI', 'Backend', 'core', 'server', true, 80),
  ('api-integrations', 'API Integrations', 'Backend', 'core', 'cable', true, 90),
  ('cloud-deployment', 'Cloud & DevOps', 'Infrastructure', 'core', 'cloud', true, 100),
  ('git-cicd', 'Git & CI/CD', 'Infrastructure', 'core', 'git-branch', true, 110),
  ('ai-agents', 'AI Agents', 'AI & Automation', 'ai', 'bot', true, 120),
  ('ai-chatbots', 'AI Chatbots', 'AI & Automation', 'ai', 'message-circle', true, 130),
  ('workflow-automation', 'Workflow Automation', 'AI & Automation', 'ai', 'workflow', true, 140),
  ('whatsapp-automation', 'WhatsApp Automation', 'AI & Automation', 'ai', 'smartphone', true, 150),
  ('llm-apps', 'LLM Apps', 'AI & Automation', 'ai', 'brain-circuit', true, 160),
  ('rag-vector-search', 'RAG / Vector Search', 'AI & Automation', 'ai', 'scan-search', true, 170),
  ('prompt-engineering', 'Prompt Engineering', 'AI & Automation', 'ai', 'sparkles', true, 180),
  ('computer-vision', 'Computer Vision', 'AI & Automation', 'ai', 'network', true, 190)
on conflict (slug) do nothing;

-- These are internal, fictional reference templates migrated from the former
-- local demo cards. They are deliberately unpublished, unfeatured, have no
-- image or URL, and use an explicit title/summary so they cannot be mistaken
-- for a DevNov client project in the admin area.
--
-- The CTE returns only records inserted by this invocation. Consequently,
-- re-running this seed never changes an existing template or adds technology
-- links back after an administrator has edited one.
with seeded_template_projects as (
  insert into public.projects (
    slug, title, summary, category, challenge, solution, outcome,
    featured, published, sort_order
  )
  values
    ('template-clinicflow', '[Template] ClinicFlow concept', 'Internal draft template only. Fictional clinic dashboard concept; it is not a DevNov client project. Replace every detail before publishing.', 'Healthcare', 'How could a small clinic simplify everyday operations?', 'Illustrative multi-role dashboard pattern with scheduling, patient records, and staff views.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 900),
    ('template-ledgerly', '[Template] Ledgerly concept', 'Internal draft template only. Fictional personal-finance dashboard concept; it is not a DevNov client project. Replace every detail before publishing.', 'SaaS Dashboard', 'How could everyday spending become easier to understand?', 'Illustrative budget summaries, categorized expenses, and readable analytics.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 910),
    ('template-lakeview', '[Template] LakeView concept', 'Internal draft template only. Fictional hospitality booking concept; it is not a DevNov client project. Replace every detail before publishing.', 'Web App', 'How can a resort simplify inquiries and bookings?', 'Illustrative guest discovery and reservation interface pattern.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 920),
    ('template-cropwise-ai', '[Template] CropWise AI concept', 'Internal draft template only. Fictional agriculture AI dashboard concept; it is not a DevNov client project. Replace every detail before publishing.', 'AI Automation', 'How might growers access crop-health insights faster?', 'Prototype-style interface pattern for image analysis and farm observations.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 930),
    ('template-pipeline-crm', '[Template] Pipeline CRM concept', 'Internal draft template only. Fictional sales CRM concept; it is not a DevNov client project. Replace every detail before publishing.', 'Business Software', 'How can growing teams follow up on leads consistently?', 'Illustrative sales workspace pattern with deal stages and follow-up reminders.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 940),
    ('template-shoplane', '[Template] ShopLane concept', 'Internal draft template only. Fictional ecommerce concept; it is not a DevNov client project. Replace every detail before publishing.', 'E-Commerce', 'How can stores make online shopping simple and fast?', 'Illustrative storefront and order-management interface pattern.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 950),
    ('template-learnnest', '[Template] LearnNest concept', 'Internal draft template only. Fictional online-learning concept; it is not a DevNov client project. Replace every detail before publishing.', 'SaaS Dashboard', 'How can remote learners stay organized?', 'Illustrative dashboard pattern with courses, lessons, and progress tracking.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 960),
    ('template-estategrid', '[Template] EstateGrid concept', 'Internal draft template only. Fictional property-discovery concept; it is not a DevNov client project. Replace every detail before publishing.', 'Web App', 'How can buyers compare properties more easily?', 'Illustrative search, filtering, and listing-detail interface pattern.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 970),
    ('template-replypilot', '[Template] ReplyPilot concept', 'Internal draft template only. Fictional AI support workspace concept; it is not a DevNov client project. Replace every detail before publishing.', 'AI Automation', 'How might support teams organize customer conversations?', 'Illustrative multi-inbox workspace pattern with AI reply suggestions and workflows.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 980),
    ('template-tablemate', '[Template] TableMate concept', 'Internal draft template only. Fictional restaurant-operations concept; it is not a DevNov client project. Replace every detail before publishing.', 'E-Commerce', 'How could restaurants reduce order handling friction?', 'Illustrative digital-menu, ordering, and table-management interface pattern.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 990),
    ('template-meetmemo', '[Template] MeetMemo concept', 'Internal draft template only. Fictional AI productivity concept; it is not a DevNov client project. Replace every detail before publishing.', 'AI Automation', 'How can teams capture decisions from meetings?', 'Illustrative interface pattern for summaries, extracted tasks, and searchable history.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 1000),
    ('template-joblens', '[Template] JobLens concept', 'Internal draft template only. Fictional job-portal concept; it is not a DevNov client project. Replace every detail before publishing.', 'Web App', 'How can job seekers find relevant roles quickly?', 'Illustrative discovery interface pattern with filters and saved opportunities.', 'Template only. No commissioned work, delivery, client, or measurable result is claimed.', false, false, 1010)
  on conflict (slug) do nothing
  returning id, slug
),
template_technology_links(project_slug, technology_slug, sort_order) as (
  values
    ('template-clinicflow', 'react', 10),
    ('template-clinicflow', 'node', 20),
    ('template-ledgerly', 'react', 10),
    ('template-lakeview', 'dotnet', 10),
    ('template-lakeview', 'sql', 20),
    ('template-cropwise-ai', 'python', 10),
    ('template-cropwise-ai', 'fastapi', 20),
    ('template-cropwise-ai', 'react', 30),
    ('template-pipeline-crm', 'dotnet', 10),
    ('template-pipeline-crm', 'react', 20),
    ('template-pipeline-crm', 'sql', 30),
    ('template-shoplane', 'node', 10),
    ('template-shoplane', 'api-integrations', 20),
    ('template-learnnest', 'react', 10),
    ('template-learnnest', 'node', 20),
    ('template-learnnest', 'mongo', 30),
    ('template-estategrid', 'next', 10),
    ('template-estategrid', 'api-integrations', 20),
    ('template-replypilot', 'ai-agents', 10),
    ('template-replypilot', 'node', 20),
    ('template-replypilot', 'react', 30),
    ('template-tablemate', 'react', 10),
    ('template-tablemate', 'api-integrations', 20),
    ('template-meetmemo', 'python', 10),
    ('template-meetmemo', 'react', 20),
    ('template-joblens', 'react', 10),
    ('template-joblens', 'workflow-automation', 20)
)
insert into public.project_technologies (project_id, technology_id, sort_order)
select projects.id, technologies.id, links.sort_order
from seeded_template_projects as projects
join template_technology_links as links on links.project_slug = projects.slug
join public.technologies as technologies on technologies.slug = links.technology_slug
on conflict (project_id, technology_id) do nothing;

commit;
