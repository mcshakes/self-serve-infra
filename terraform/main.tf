module "ec2" {
  source = "./modules/ec2"

  ami_id           = var.ami_id
  instance_type    = var.instance_type
  instance_count   = var.instance_count
  environment_name = var.environment_name
}
