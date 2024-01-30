# Uses HTTParty to make requests to Supabase
module SupabaseHelper
  def supabase_request(path:, method:, body: {}, headers: {})
    JSON.parse(HTTParty.send(method, "#{ENV["SUPABASE_URL"]}#{path}", body: body, headers: default_headers.merge(headers)).body)
  end

  private

  def default_headers
    {
      "apikey" => ENV["SUPABASE_SECRET_SERVICE_ROLE_KEY"],
      "Authorization" => "Bearer #{ENV["SUPABASE_SECRET_SERVICE_ROLE_KEY"]}"
    }
  end
end
