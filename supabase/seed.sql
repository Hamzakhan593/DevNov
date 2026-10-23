-- Initial content migrated from src/data/agencyData.js.
-- Safe to run repeatedly: existing records (including admin edits) are left
-- untouched.  Run schema.sql first.

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

commit;
