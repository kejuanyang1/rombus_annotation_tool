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
    (ontable big screw)
    (ontable small allmax battery)
    (ontable pink basket)
    (ontable yellow basket)
    (clear glue stick)
    (clear screwdriver)
    (clear blue stripper)
    (clear big screw)
    (clear small allmax battery)
    (clear pink basket)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)