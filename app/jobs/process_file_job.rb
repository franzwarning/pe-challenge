class ProcessFileJob < ApplicationJob
  queue_as :default

  def perform(user_file_id)
    print "Processing file #{user_file_id}"
  end
end
