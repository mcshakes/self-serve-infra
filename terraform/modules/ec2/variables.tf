variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}
# Probably best to default to cheapest/free for now

variable "instance_count" {
  description = "Number of EC2 instances to create"
  type        = number
  default     = 1
}

variable "environment_name" {
  description = "Name of environment"
  type        = string
}

variable "ami_id" {
  description = "The ID of the machine image (AMI) to use for the server"
  type        = string
  nullable    = false
}
