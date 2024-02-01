class AnonymousUserSerializer < ActiveModel::Serializer
  attributes :id, :uuid # Add other fields that are always included
end
