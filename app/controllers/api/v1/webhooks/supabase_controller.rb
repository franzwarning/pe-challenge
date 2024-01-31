class Api::V1::Webhooks::SupabaseController < ActionController::API
  wrap_parameters false

  def create
    file = UserFile.find_by(bucket_path: webhook_params[:name])
    file.uploaded = true
    file.save!

    ProcessFileJob.perform_later(file.id)

    render json: {message: "ok"}
  end

  private

  def webhook_params
    params.require(:record).permit(
      :name,
      :id,
      :owner,
      :version,
      {metadata: [:eTag, :size, :mimetype, :cacheControl, :lastModified, :contentLength, :httpStatusCode]},
      {path_tokens: []},
      :owner_id,
      :bucket_id,
      :created_at,
      :updated_at,
      :last_accessed_at
    )
  end
end
