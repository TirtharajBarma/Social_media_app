#!/bin/bash

echo "🚀 Deploying..."

# Check if secrets file exists
if [ ! -f "infra/ansible/secrets.yml" ]; then
    echo "❌ Error: secrets.yml not found!"
    echo "Copy infra/ansible/secrets.yml.example to secrets.yml and fill with your values"
    exit 1
fi

# 1. Terraform
cd infra/terraform
terraform init
terraform apply -auto-approve

if [ $? -ne 0 ]; then
    echo "❌ Terraform apply failed!"
    exit 1
fi

EC2_IP=$(terraform output -raw app_ip)
echo "📍 New EC2 IP: $EC2_IP"

# 2. Ansible
cd ../ansible
echo "🔄 Creating fresh inventory with IP: $EC2_IP"
rm -f inventory.yml
sed "s/{{EC2_IP}}/$EC2_IP/g" inventory_template.yml > inventory.yml

echo "⏳ Waiting 60 seconds for EC2 instance to be ready..."
sleep 60

echo "🔧 Running Ansible playbook..."
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.yml playbook.yml --private-key ~/.ssh/key.pem

echo "✅ Done! App at: http://$EC2_IP"