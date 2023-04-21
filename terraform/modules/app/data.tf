data "aws_acm_certificate" "this" {
  domain   = var.route53_hosted_zone_name
  statuses = ["ISSUED"]
}
