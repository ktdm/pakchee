class Site < ActiveRecord::Base

  has_many :roles, inverse_of: :sites
  has_many :keys, through: :roles

  accepts_nested_attributes_for :roles

  after_save :generate_state_ref
  serialize :ops, Hash

  private
    def generate_state_ref
      unless self.state
        self.state = self.id.hash.to_s(16)
        self.save
        Dir.mkdir(File.join(Rails.root, "storage", self.state)) unless File.directory?(File.join(Rails.root, "storage", self.state))
        FileUtils.chmod("og=t,u=rwx", File.join(Rails.root, "storage", self.state))
      end
    end

end
