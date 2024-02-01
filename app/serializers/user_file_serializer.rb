class UserFileSerializer < ActiveModel::Serializer
  attributes :id, :file_name, :description, :price_usd
  attribute :presigned_upload_url, if: :owner?

  belongs_to :anonymous_user, serializer: AnonymousUserSerializer

  def owner?
    object.anonymous_user.id == current_user.id
  end

  def current_user
    instance_options[:context][:anonymous_user]
  end
end
