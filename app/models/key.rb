class Key < ActiveRecord::Base
  belongs_to :site

  validates :role,
    presence: true,
    inclusion: { in: %w(basic council),
      message: "%{value} not a valid role." }
end
