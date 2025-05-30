(define (problem scene)
  (:domain manip)
  (:objects
    office_02 - item
    office_07 - item
    container_05 - container
    container_06 - container
  )
  (:init
    (in office_02 container_05)
    (ontable office_07)
    (ontable container_05)
    (ontable container_06)
    (clear office_07)
    (handempty)
  )
  (:goal (and ))
)