
#
# WepSIM (https://wepsim.github.io/wepsim/)
#

# Error: non-open string (..."")

.data
        str: .string Bad string"
	tag1: .byte   1

.text
	main: li t1 0
	      jr ra
