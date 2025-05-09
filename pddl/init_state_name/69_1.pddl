(define (problem scene1)
  (:domain manip)
  (:objects
    glue stick - item
    screwdriver - item
    blue stripper - item
    big screw - item
    small allmax battery - support
    pink basket - container
    yellow basket - container
  )
  (:init
    (ontable glue stick)
    (ontable screwdriver)
    (ontable blue stripper)
    (in big screw yellow basket)
    (in small allmax battery pink basket)
    (closed pink basket)
    (closed yellow basket)
    (handempty)
    (clear glue stick)
    (clear screwdriver)
    (clear blue stripper)
  )
  (:goal (and ))
)