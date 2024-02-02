module OpenaiHelper
  require "openai"

  def openai_client
    @openai_client ||= OpenAI::Client.new(access_token: ENV["OPENAI_API_KEY"])
  end
end
