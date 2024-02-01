class UserFileSerializer < ActiveModel::Serializer
  attributes :id, :file_name, :description, :price_usd
  attribute :presigned_upload_url, if: :owner?

  belongs_to :anonymous_user, serializer: AnonymousUserSerializer

  def owner?
    object.anonymous_user.id == instance_options[:anonymous_user].id
  end
end
