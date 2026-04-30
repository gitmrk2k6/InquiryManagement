output "ec2_public_ip" {
  description = "EC2 instance Elastic IP (use this for SSH and browser access)"
  value       = aws_eip.app.public_ip
}

output "rds_endpoint" {
  description = "RDS MySQL endpoint (set as DATABASE_HOST in backend .env)"
  value       = aws_db_instance.main.address
}

output "ssh_command" {
  description = "SSH command to connect to EC2"
  value       = "ssh -i <your-key.pem> ec2-user@${aws_eip.app.public_ip}"
}
