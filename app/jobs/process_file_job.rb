class ProcessFileJob < ApplicationJob
  include OpenaiHelper
  include SupabaseHelper

  queue_as :default

  def generate_description_and_price(file, file_size)
    chat_prompt = "
      Given the filename \"#{file.file_name}\", a file size of #{file_size} Bytes, and a mimetype of #{file.mime_type}, make up a 4 to 5 sentence description of the file.
      The description should be user friendly, and be assertive of what is in the file. You might have to fake what's in the file, and make up a story.
      Do not mention the file name, file size, or mime type. Additionally, return what you think the price should be based on the story you create.
      The range for the price could be anywhere between $0 to $100. Don't be afraid to assign a price of 0 if that makes sense.
      Return the response in the JSON format with two keys PRICE_USD and DESCRIPTION. For example {\"DESCRIPTION\": \"blah\", \"PRICE_USD\":\"10\"}
    "

    print("Chat prompt: #{chat_prompt}")

    # generate a description of the file from openai
    chat_response = openai_client.chat(
      parameters: {
        model: "gpt-4-turbo-preview",
        messages: [{role: "user", content: chat_prompt}],
        temperature: 1
      }
    )
    message_string = chat_response["choices"][0]["message"]["content"]
    message_string = message_string.gsub("```json\n", "").gsub("```", "")
    message_json = JSON.parse(message_string)
    file.description = message_json["DESCRIPTION"]
    file.price_usd = message_json["PRICE_USD"]
    file.save!
  end

  def perform(user_file_id, file_size)
    print "Processing file #{user_file_id}"
    file = UserFile.find_by(id: user_file_id)

    t1 = Thread.new { generate_description_and_price(file, file_size) }
    t1.join
  end
end
