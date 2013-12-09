class Role < ActiveRecord::Base

  belongs_to :keys
  belongs_to :sites

  has_one :key
  has_one :site

  accepts_nested_attributes_for :site
  accepts_nested_attributes_for :key

  validates :title,
    presence: true,
    inclusion: { in: %w(basic mod),
      message: "%{value} not a valid role." }

end
