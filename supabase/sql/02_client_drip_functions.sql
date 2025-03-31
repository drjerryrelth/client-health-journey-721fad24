
-- Create function to retrieve a client's drip message for the current day
CREATE OR REPLACE FUNCTION public.get_client_daily_drip(client_id_param UUID)
RETURNS TABLE (
  id UUID,
  subject TEXT,
  content TEXT,
  day_number INTEGER,
  is_read BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cdm.id,
    dct.subject,
    dct.content,
    cdm.day_number,
    cdm.is_read
  FROM 
    client_drip_messages cdm
  JOIN 
    drip_content_templates dct ON cdm.drip_template_id = dct.id
  WHERE 
    cdm.client_id = client_id_param
  ORDER BY 
    cdm.sent_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark a message as read
CREATE OR REPLACE FUNCTION public.mark_message_as_read(message_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE client_drip_messages 
  SET is_read = TRUE
  WHERE id = message_id_param;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
