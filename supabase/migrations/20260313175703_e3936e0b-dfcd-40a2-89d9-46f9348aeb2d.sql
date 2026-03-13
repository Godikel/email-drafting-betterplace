
INSERT INTO storage.buckets (id, name, public) VALUES ('email-images', 'email-images', true);

CREATE POLICY "Anyone can view email images" ON storage.objects FOR SELECT USING (bucket_id = 'email-images');
CREATE POLICY "Anyone can upload email images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'email-images');
CREATE POLICY "Anyone can update email images" ON storage.objects FOR UPDATE USING (bucket_id = 'email-images');
CREATE POLICY "Anyone can delete email images" ON storage.objects FOR DELETE USING (bucket_id = 'email-images');
