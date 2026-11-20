resource "aws_instance" "vm" {
  ami           = var.ami_id
  instance_type = var.instance_type
  count         = var.instance_count

  tags = {
    Name = "${var.environment_name}-${count.index + 1}"
  }
}