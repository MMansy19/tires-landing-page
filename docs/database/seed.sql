-- Sample brands
insert into public.brands (name, logo_url) values
  ('ميشلان', null),
  ('بريدجستون', null),
  ('كونتيننتال', null),
  ('بيريللي', null),
  ('جوديير', null),
  ('هانكوك', null);

-- Sample products
insert into public.products (name, slug, description, price, category, image_url, is_featured) values
  ('إطار ميشلان بايلوت سبورت 5', 'michelin-pilot-sport-5', 'إطار رياضي عالي الأداء مصمم للقيادة الديناميكية مع ثبات استثنائي', 4500.00, 'سيارات ركاب', null, true),
  ('إطار بريدجستون تورانزا', 'bridgestone-turanza', 'إطار فاخر يوفر راحة القيادة وهدوء استثنائي على الطرق المعبدة', 3800.00, 'سيارات ركاب', null, true),
  ('إطار كونتيننتال كروس كونتاكت', 'continental-crosscontact', 'إطار متعدد الاستخدامات مصمم لسيارات الدفع الرباعي والأراضي الوعرة', 5200.00, 'دفع رباعي', null, true),
  ('إطار بيريللي سكوربيون', 'pirelli-scorpion', 'إطار SUV متطور يجمع بين الأداء على الطرق والقدرة على الطرق الوعرة', 4800.00, 'دفع رباعي', null, false),
  ('إطار جوديير كارجو', 'goodyear-cargo', 'إطار تجاري شديد التحمل مصمم للشاحنات وسيارات النقل', 3200.00, 'مركبات تجارية', null, false);

-- Sample blog post
insert into public.posts (title, slug, content, excerpt, published) values
  ('كيف تختار الإطار المناسب لسيارتك', 'how-to-choose-right-tire', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"اختيار الإطار المناسب هو أحد أهم القرارات التي يمكنك اتخاذها لسلامتك على الطريق."}]}]}', 'دليل شامل لاختيار الإطارات المناسبة لنوع سيارتك وأسلوب قيادتك', true);
