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
    (ontable big screw)
    (ontable small allmax battery)
    (in blue stripper yellow basket)
    (ontable pink basket)
    (ontable yellow basket)
    (handempty)
    (clear glue stick)
    (clear screwdriver)
    (clear big screw)
    (clear small allmax battery)
    (clear blue stripper)
    (clear pink basket)
    (clear yellow basket)
  )
  (:goal (and ))
)