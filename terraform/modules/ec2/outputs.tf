output "instance_ids" {
  description = "IDs of provisioned EC2 instances"
  value       = aws_instance.vm[*].id
}

output "public_ips" {
  description = "Public IP addresses of provisioned instances"
  value       = aws_instance.vm[*].public_ip
}